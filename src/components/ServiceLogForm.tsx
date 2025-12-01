import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEffect, useState, useRef } from 'react';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import {
  ChevronDownIcon,
  CheckCircledIcon,
  FileTextIcon,
} from '@radix-ui/react-icons';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addServiceLog } from '../store/serviceLogSlice';
import { ServiceType } from '../types';
import type { Draft } from '../types';
import {
  generateId,
  getCurrentTimestamp,
  getTodayString,
  getTomorrowString,
} from '../utils/dateUtils';
import {
  addDraft,
  updateDraft,
  deleteDraft,
  clearAllDrafts,
  setSaveStatus,
  setCurrentDraftId,
} from '../store/draftSlice';
import { ConfirmDialog } from './ConfirmDialog';

interface FormValues {
  providerId: string;
  serviceOrder: string;
  carId: string;
  odometer: string;
  engineHours: string;
  startDate: string;
  endDate: string;
  type: string;
  serviceDescription: string;
}

const serializeFormValues = (values: FormValues) => JSON.stringify(values);

const validationSchema = Yup.object({
  providerId: Yup.string().required('Provider ID is required'),
  serviceOrder: Yup.string().required('Service Order is required'),
  carId: Yup.string().required('Car ID is required'),
  odometer: Yup.number()
    .required('Odometer is required')
    .positive('Must be a positive number')
    .integer('Must be a whole number'),
  engineHours: Yup.number()
    .required('Engine Hours is required')
    .positive('Must be a positive number'),
  startDate: Yup.string().required('Start Date is required'),
  endDate: Yup.string().required('End Date is required'),
  type: Yup.string().required('Service Type is required'),
  serviceDescription: Yup.string().required('Service Description is required'),
});

export function ServiceLogForm() {
  const dispatch = useAppDispatch();

  // Redux state
  const currentDraftId = useAppSelector((state) => state.drafts.currentDraftId);
  const drafts = useAppSelector((state) => state.drafts.drafts);
  const saveStatus = useAppSelector((state) => state.drafts.saveStatus);

  // Local state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clearAllConfirmOpen, setClearAllConfirmOpen] = useState(false);
  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedValuesRef = useRef<string>('');

  const formik = useFormik<FormValues>({
    initialValues: {
      providerId: '',
      serviceOrder: '',
      carId: '',
      odometer: '',
      engineHours: '',
      startDate: getTodayString(),
      endDate: getTomorrowString(),
      type: ServiceType.PLANNED as string,
      serviceDescription: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const timestamp = getCurrentTimestamp();
      const serviceLog = {
        id: generateId(),
        providerId: values.providerId,
        serviceOrder: values.serviceOrder,
        carId: values.carId,
        odometer: Number(values.odometer),
        engineHours: Number(values.engineHours),
        startDate: values.startDate,
        endDate: values.endDate,
        type: values.type as ServiceType,
        serviceDescription: values.serviceDescription,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      dispatch(addServiceLog(serviceLog));

      // Clean up draft after creating service log
      if (currentDraftId) {
        dispatch(deleteDraft(currentDraftId));
        dispatch(setCurrentDraftId(null));
        // dispatch(setSaveStatus('idle'));
        lastSavedValuesRef.current = '';
      }

      resetForm();
    },
  });
  const formikSetValues = formik.setValues;

  // Load draft when selected
  useEffect(() => {
    if (!currentDraftId) return;

    const draft = drafts.find((d) => d.id === currentDraftId);
    if (!draft) return;

    const draftValues: FormValues = {
      providerId: draft.providerId,
      serviceOrder: draft.serviceOrder,
      carId: draft.carId,
      odometer: draft.odometer,
      engineHours: draft.engineHours,
      startDate: draft.startDate,
      endDate: draft.endDate,
      type: draft.type as unknown as string,
      serviceDescription: draft.serviceDescription,
    };

    const draftSnapshot = serializeFormValues(draftValues);

    if (lastSavedValuesRef.current === draftSnapshot) {
      return;
    }

    formikSetValues(draftValues);
    lastSavedValuesRef.current = draftSnapshot;
    // dispatch(setSaveStatus('saved'));
  }, [currentDraftId, drafts, dispatch, formikSetValues]);

  // Debounced auto-save
  useEffect(() => {
    if (!currentDraftId) {
      lastSavedValuesRef.current = '';
      return undefined;
    }

    const currentSnapshot = serializeFormValues(formik.values);

    if (lastSavedValuesRef.current === currentSnapshot) {
      return undefined;
    }

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      const draft: Draft = {
        id: currentDraftId,
        providerId: formik.values.providerId,
        serviceOrder: formik.values.serviceOrder,
        carId: formik.values.carId,
        odometer: formik.values.odometer,
        engineHours: formik.values.engineHours,
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
        type: formik.values.type as ServiceType,
        serviceDescription: formik.values.serviceDescription,
        lastSaved: getCurrentTimestamp(),
        isSaved: true,
      };

      // dispatch(updateDraft(draft));
      lastSavedValuesRef.current = currentSnapshot;
    }, 300);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formik.values, currentDraftId, dispatch]);

  // Auto-update endDate when startDate changes
  useEffect(() => {
    if (formik.values.startDate) {
      const startDate = new Date(formik.values.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      const endDateString = endDate.toISOString().split('T')[0];

      if (formik.values.endDate !== endDateString) {
        formik.setFieldValue('endDate', endDateString);
      }
    }
  }, [formik.values.startDate]);

  // Draft handlers
  const handleCreateDraft = () => {
    const draftId = generateId();
    const draft: Draft = {
      id: draftId,
      providerId: formik.values.providerId,
      serviceOrder: formik.values.serviceOrder,
      carId: formik.values.carId,
      odometer: formik.values.odometer,
      engineHours: formik.values.engineHours,
      startDate: formik.values.startDate,
      endDate: formik.values.endDate,
      type: formik.values.type as ServiceType,
      serviceDescription: formik.values.serviceDescription,
      lastSaved: getCurrentTimestamp(),
      isSaved: true,
    };

    dispatch(addDraft(draft));
    dispatch(setCurrentDraftId(draftId));
    lastSavedValuesRef.current = serializeFormValues(formik.values);
    dispatch(setSaveStatus('saving'));

    setTimeout(() => {
      dispatch(setSaveStatus('saved'));
    }, 500);
  };

  const handleDeleteDraft = () => {
    if (!currentDraftId) return;
    dispatch(deleteDraft(currentDraftId));
    dispatch(setCurrentDraftId(null));
    dispatch(setSaveStatus('idle'));
    lastSavedValuesRef.current = '';
    formik.resetForm();
  };

  const handleClearAllDrafts = () => {
    dispatch(clearAllDrafts());
    dispatch(setCurrentDraftId(null));
    dispatch(setSaveStatus('idle'));
    lastSavedValuesRef.current = '';
    formik.resetForm();
  };

  return (
    <>
      {/* Drafts Section - Separate Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <FileTextIcon className="w-5 h-5 text-gray-700 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Drafts</h3>
            <p className="text-sm text-gray-500 mt-1">
              Select a draft to continue editing or create a new one
            </p>
          </div>
        </div>

        {/* Draft List */}
        {drafts.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {drafts.map((draft) => (
              <button
                key={draft.id}
                type="button"
                onClick={() => dispatch(setCurrentDraftId(draft.id))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentDraftId === draft.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Draft {draft.id.slice(0, 13)}
              </button>
            ))}
          </div>
        )}

        {/* Status Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {currentDraftId
              ? saveStatus === 'saved'
                ? ''
                : 'Saving draft...'
              : 'No active draft'}
          </div>
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <span className="text-sm text-gray-500">Saving...</span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircledIcon className="w-4 h-4" />
                Draft saved
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Service Log Form - Separate Card */}
      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Service Log Details
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the service log information. Data is auto-saved as you type.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label.Root
                  htmlFor="providerId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Provider ID
                </Label.Root>
                <input
                  id="providerId"
                  name="providerId"
                  type="text"
                  placeholder="Enter provider ID"
                  value={formik.values.providerId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.providerId && formik.errors.providerId && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.providerId}
                  </p>
                )}
              </div>

              <div>
                <Label.Root
                  htmlFor="serviceOrder"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Order
                </Label.Root>
                <input
                  id="serviceOrder"
                  name="serviceOrder"
                  type="text"
                  placeholder="Enter service order"
                  value={formik.values.serviceOrder}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.serviceOrder && formik.errors.serviceOrder && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.serviceOrder}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label.Root
                  htmlFor="carId"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Car ID
                </Label.Root>
                <input
                  id="carId"
                  name="carId"
                  type="text"
                  placeholder="Enter car ID"
                  value={formik.values.carId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.carId && formik.errors.carId && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.carId}
                  </p>
                )}
              </div>

              <div>
                <Label.Root
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Type
                </Label.Root>
                <Select.Root
                  value={formik.values.type}
                  onValueChange={(value) => formik.setFieldValue('type', value)}
                >
                  <Select.Trigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white flex items-center justify-between">
                    <Select.Value />
                    <Select.Icon>
                      <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
                      <Select.Viewport className="p-1">
                        <Select.Item
                          value={ServiceType.PLANNED}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded outline-none data-[highlighted]:bg-gray-50"
                        >
                          <Select.ItemText>Planned</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value={ServiceType.UNPLANNED}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded outline-none data-[highlighted]:bg-gray-50"
                        >
                          <Select.ItemText>Unplanned</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value={ServiceType.EMERGENCY}
                          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 rounded outline-none data-[highlighted]:bg-gray-50"
                        >
                          <Select.ItemText>Emergency</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                {formik.touched.type && formik.errors.type && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.type}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label.Root
                  htmlFor="odometer"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Odometer (mi)
                </Label.Root>
                <input
                  id="odometer"
                  name="odometer"
                  type="number"
                  placeholder="0"
                  value={formik.values.odometer}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.odometer && formik.errors.odometer && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.odometer}
                  </p>
                )}
              </div>

              <div>
                <Label.Root
                  htmlFor="engineHours"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Engine Hours
                </Label.Root>
                <input
                  id="engineHours"
                  name="engineHours"
                  type="number"
                  placeholder="0"
                  value={formik.values.engineHours}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.engineHours && formik.errors.engineHours && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.engineHours}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label.Root
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Start Date
                </Label.Root>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formik.values.startDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.startDate}
                  </p>
                )}
              </div>

              <div>
                <Label.Root
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  End Date
                </Label.Root>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formik.values.endDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.endDate}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label.Root
                htmlFor="serviceDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Service Description
              </Label.Root>
              <textarea
                id="serviceDescription"
                name="serviceDescription"
                rows={4}
                placeholder="Describe the service performed..."
                value={formik.values.serviceDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              />
              {formik.touched.serviceDescription &&
                formik.errors.serviceDescription && (
                  <p className="mt-1 text-xs text-red-600">
                    {formik.errors.serviceDescription}
                  </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center gap-3">
              {/* Create Service Log Button */}
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Create Service Log
              </button>

              {/* Create Draft Button */}
              <button
                type="button"
                onClick={handleCreateDraft}
                className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium text-sm transition-colors"
              >
                Create Draft
              </button>

              {/* Delete Draft Button - only show when draft is active */}
              {currentDraftId && (
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                  Delete Draft
                </button>
              )}

              {/* Clear All Drafts Button */}
              {drafts.length > 0 && (
                <button
                  type="button"
                  onClick={() => setClearAllConfirmOpen(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium text-sm transition-colors"
                >
                  Clear All Drafts
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Draft"
        description="Are you sure you want to delete this draft? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteDraft}
      />

      <ConfirmDialog
        open={clearAllConfirmOpen}
        onOpenChange={setClearAllConfirmOpen}
        title="Clear All Drafts"
        description={`Are you sure you want to clear all ${
          drafts.length
        } draft${
          drafts.length === 1 ? '' : 's'
        }? This action cannot be undone.`}
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleClearAllDrafts}
      />
    </>
  );
}

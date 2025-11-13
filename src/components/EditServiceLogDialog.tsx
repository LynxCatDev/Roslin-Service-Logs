import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as Dialog from '@radix-ui/react-dialog';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import { Cross2Icon, ChevronDownIcon } from '@radix-ui/react-icons';
import type { ServiceLog } from '../types';
import { ServiceType } from '../types';
import { useAppDispatch } from '../store/hooks';
import { updateServiceLog } from '../store/serviceLogSlice';

interface Props {
  log: ServiceLog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const validationSchema = Yup.object({
  providerId: Yup.string().required('Provider ID is required'),
  serviceOrder: Yup.string().required('Service Order is required'),
  carId: Yup.string().required('Car ID is required'),
  odometer: Yup.number()
    .required('Odometer is required')
    .positive('Must be positive')
    .integer('Must be an integer'),
  engineHours: Yup.number()
    .required('Engine Hours is required')
    .positive('Must be positive'),
  startDate: Yup.string().required('Start Date is required'),
  endDate: Yup.string().required('End Date is required'),
  type: Yup.string().required('Service Type is required'),
  serviceDescription: Yup.string().required('Service Description is required'),
});

export function EditServiceLogDialog({ log, open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      providerId: log?.providerId || '',
      serviceOrder: log?.serviceOrder || '',
      carId: log?.carId || '',
      odometer: log?.odometer.toString() || '',
      engineHours: log?.engineHours.toString() || '',
      startDate: log?.startDate || '',
      endDate: log?.endDate || '',
      type: log?.type || ServiceType.PLANNED,
      serviceDescription: log?.serviceDescription || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (log) {
        dispatch(
          updateServiceLog({
            ...log,
            providerId: values.providerId,
            serviceOrder: values.serviceOrder,
            carId: values.carId,
            odometer: Number(values.odometer),
            engineHours: Number(values.engineHours),
            startDate: values.startDate,
            endDate: values.endDate,
            type: values.type as ServiceType,
            serviceDescription: values.serviceDescription,
          }),
        );
        onOpenChange(false);
      }
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Edit Service Log
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500 mt-1">
                  Update the service log information below.
                </Dialog.Description>
              </div>
              <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
                <Cross2Icon className="w-5 h-5" />
              </Dialog.Close>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label.Root
                    htmlFor="edit-providerId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Provider ID
                  </Label.Root>
                  <input
                    id="edit-providerId"
                    name="providerId"
                    type="text"
                    placeholder="ABC123"
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
                    htmlFor="edit-serviceOrder"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Service Order
                  </Label.Root>
                  <input
                    id="edit-serviceOrder"
                    name="serviceOrder"
                    type="text"
                    placeholder="SO-2024-001"
                    value={formik.values.serviceOrder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  {formik.touched.serviceOrder &&
                    formik.errors.serviceOrder && (
                      <p className="mt-1 text-xs text-red-600">
                        {formik.errors.serviceOrder}
                      </p>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label.Root
                    htmlFor="edit-carId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Car ID
                  </Label.Root>
                  <input
                    id="edit-carId"
                    name="carId"
                    type="text"
                    placeholder="CAR-001"
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
                    htmlFor="edit-type"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Service Type
                  </Label.Root>
                  <Select.Root
                    value={formik.values.type}
                    onValueChange={(value) =>
                      formik.setFieldValue('type', value)
                    }
                  >
                    <Select.Trigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-left flex items-center justify-between">
                      <Select.Value />
                      <Select.Icon>
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50">
                        <Select.Viewport>
                          <Select.Item
                            value={ServiceType.PLANNED}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
                          >
                            <Select.ItemText>Planned</Select.ItemText>
                          </Select.Item>
                          <Select.Item
                            value={ServiceType.UNPLANNED}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
                          >
                            <Select.ItemText>Unplanned</Select.ItemText>
                          </Select.Item>
                          <Select.Item
                            value={ServiceType.EMERGENCY}
                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
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
                    htmlFor="edit-odometer"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Odometer (mi)
                  </Label.Root>
                  <input
                    id="edit-odometer"
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
                    htmlFor="edit-engineHours"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Engine Hours
                  </Label.Root>
                  <input
                    id="edit-engineHours"
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
                    htmlFor="edit-startDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Start Date
                  </Label.Root>
                  <input
                    id="edit-startDate"
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
                    htmlFor="edit-endDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    End Date
                  </Label.Root>
                  <input
                    id="edit-endDate"
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
                  htmlFor="edit-serviceDescription"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Description
                </Label.Root>
                <textarea
                  id="edit-serviceDescription"
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

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

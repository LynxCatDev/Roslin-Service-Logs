import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useAppDispatch } from '../store/hooks';
import { addServiceLog } from '../store/serviceLogSlice';
import { ServiceType } from '../types';
import {
  generateId,
  getCurrentTimestamp,
  getTodayString,
  getTomorrowString,
} from '../utils/dateUtils';

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

  const formik = useFormik({
    initialValues: {
      providerId: '',
      serviceOrder: '',
      carId: '',
      odometer: '',
      engineHours: '',
      startDate: getTodayString(),
      endDate: getTomorrowString(),
      type: ServiceType.PLANNED,
      serviceDescription: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      const timestamp = getCurrentTimestamp();
      dispatch(
        addServiceLog({
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
        }),
      );
      resetForm();
    },
  });

  return (
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

          <div className="pt-4">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Create Service Log
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

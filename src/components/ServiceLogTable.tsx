import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { deleteServiceLog } from '../store/serviceLogSlice';
import type { ServiceLog } from '../types';
import { ServiceType } from '../types';
import { format } from 'date-fns';
import * as Label from '@radix-ui/react-label';
import * as Select from '@radix-ui/react-select';
import { Table } from '@radix-ui/themes';
import { Pencil1Icon, TrashIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import { deleteLog } from '../utils/localStorage';
import { ConfirmDialog } from './ConfirmDialog';

interface Props {
  onEdit: (log: ServiceLog) => void;
}

export function ServiceLogTable({ onEdit }: Props) {
  const dispatch = useAppDispatch();
  const logs = useAppSelector((state) => state.serviceLogs.logs);

  const [searchTerm, setSearchTerm] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<ServiceType | 'all'>('all');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.providerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.serviceOrder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.carId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStartDate =
      !startDateFilter || log.startDate >= startDateFilter;
    const matchesEndDate = !endDateFilter || log.endDate <= endDateFilter;
    const matchesType = typeFilter === 'all' || log.type === typeFilter;

    return matchesSearch && matchesStartDate && matchesEndDate && matchesType;
  });

  const handleDelete = async (id: string) => {
    setLogToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (logToDelete) {
      dispatch(deleteServiceLog(logToDelete));
      await deleteLog(logToDelete);
      setLogToDelete(null);
    }
  };

  const getTypeBadgeColor = (type: ServiceType) => {
    switch (type) {
      case ServiceType.PLANNED:
        return 'bg-blue-100 text-blue-700';
      case ServiceType.UNPLANNED:
        return 'bg-yellow-100 text-yellow-700';
      case ServiceType.EMERGENCY:
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Filters & Search
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label.Root
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Search
            </Label.Root>
            <input
              id="search"
              type="text"
              placeholder="Search by Provider, Service Order, or Car ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <Label.Root
              htmlFor="startDateFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Start Date From
            </Label.Root>
            <input
              id="startDateFilter"
              type="date"
              value={startDateFilter}
              onChange={(e) => setStartDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <Label.Root
              htmlFor="typeFilter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Service Type
            </Label.Root>
            <Select.Root
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as ServiceType | 'all')
              }
            >
              <Select.Trigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-left flex items-center justify-between">
                <Select.Value />
                <Select.Icon>
                  <ChevronDownIcon />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                  <Select.Viewport>
                    <Select.Item
                      value="all"
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 outline-none"
                    >
                      <Select.ItemText>All Types</Select.ItemText>
                    </Select.Item>
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
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-semibold text-gray-900">
          Service Logs ({filteredLogs.length})
        </h3>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">
            No service logs found. Create your first service log above.
          </p>
        </div>
      ) : (
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Provider ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Service Order</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Car ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Odometer</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Engine Hours</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Start Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>End Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredLogs.map((log) => (
              <Table.Row key={log.id}>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(log)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Pencil1Icon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </Table.Cell>
                <Table.Cell>{log.providerId}</Table.Cell>
                <Table.Cell>{log.serviceOrder}</Table.Cell>
                <Table.Cell>{log.carId}</Table.Cell>
                <Table.Cell>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(
                      log.type,
                    )}`}
                  >
                    {log.type}
                  </span>
                </Table.Cell>
                <Table.Cell>{log.odometer.toLocaleString()} mi</Table.Cell>
                <Table.Cell>{log.engineHours}</Table.Cell>
                <Table.Cell>
                  {format(new Date(log.startDate), 'MMM dd, yyyy')}
                </Table.Cell>
                <Table.Cell>
                  {format(new Date(log.endDate), 'MMM dd, yyyy')}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Service Log"
        description="Are you sure you want to delete this service log? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'danger',
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                variant === 'danger'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}
            >
              <ExclamationTriangleIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Dialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mb-6">
                {description}
              </Dialog.Description>
              <div className="flex justify-end gap-3">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {cancelLabel}
                  </button>
                </Dialog.Close>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    variant === 'danger'
                      ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                      : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                  }`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                aria-label="Close"
              >
                <Cross2Icon className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon, CheckCircledIcon, FileTextIcon } from '@radix-ui/react-icons';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setCurrentDraftId } from '../store/draftSlice';
import { format } from 'date-fns';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DraftDialog({ open, onOpenChange }: Props) {
  const dispatch = useAppDispatch();
  const drafts = useAppSelector((state) => state.drafts.drafts);

  const handleSelectDraft = (draftId: string) => {
    dispatch(setCurrentDraftId(draftId));
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FileTextIcon className="w-5 h-5" />
                  Drafts
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500 mt-1">
                  Select a draft to continue editing or create a new one
                </Dialog.Description>
              </div>
              <Dialog.Close className="text-gray-400 hover:text-gray-600 transition-colors">
                <Cross2Icon className="w-5 h-5" />
              </Dialog.Close>
            </div>

            {drafts.length === 0 ? (
              <div className="text-center py-12">
                <FileTextIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  No drafts yet. Create your first draft to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {drafts.map((draft) => (
                  <button
                    key={draft.id}
                    onClick={() => handleSelectDraft(draft.id)}
                    className="w-full text-left p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-900">
                            Draft {draft.id.slice(6, 12)}
                          </span>
                          {draft.isSaved && (
                            <CheckCircledIcon className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          {draft.providerId && (
                            <div>Provider: {draft.providerId}</div>
                          )}
                          {draft.serviceOrder && (
                            <div>Service Order: {draft.serviceOrder}</div>
                          )}
                          {draft.carId && <div>Car: {draft.carId}</div>}
                          <div>Type: {draft.type}</div>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Last saved: {format(new Date(draft.lastSaved), 'MMM dd, yyyy HH:mm')}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

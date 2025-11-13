import { useState } from 'react';
import { ServiceLogForm } from './components/ServiceLogForm';
import { ServiceLogTable } from './components/ServiceLogTable';
import { EditServiceLogDialog } from './components/EditServiceLogDialog';
import type { ServiceLog } from './types';

function App() {
  const [editingLog, setEditingLog] = useState<ServiceLog | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (log: ServiceLog) => {
    setEditingLog(log);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Service Log Management
              </h1>
              <p className="text-sm text-gray-500">
                Create, manage, and track vehicle service logs.
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-6">
          <ServiceLogForm />
          <ServiceLogTable onEdit={handleEdit} />
        </div>
      </main>

      <EditServiceLogDialog
        log={editingLog}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
}

export default App;

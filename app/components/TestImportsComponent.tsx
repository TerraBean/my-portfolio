'use client';

// Test component to verify all UI dependencies work correctly in React
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AlertCircle, Bell, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function TestImportsComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const showToast = () => {
    toast.success('Dependencies are working correctly!', {
      description: 'All UI components have been successfully installed.',
      action: {
        label: 'Close',
        onClick: () => console.log('Toast closed'),
      },
    });
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Check className="text-green-500" />
        Dependencies Test
      </h2>
      
      <div className="space-y-4">
        {/* Test Lucide React icons */}
        <div className="flex items-center gap-2">
          <AlertCircle className="text-orange-500" />
          <Bell className="text-blue-500" />
          <Check className="text-green-500" />
          <span>Lucide React icons working</span>
        </div>

        {/* Test Sonner toast */}
        <button
          onClick={showToast}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Sonner Toast
        </button>

        {/* Test Radix Alert Dialog */}
        <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialog.Trigger asChild>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Test Radix Dialog
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <AlertDialog.Title className="text-lg font-bold mb-2">
                Dependencies Test
              </AlertDialog.Title>
              <AlertDialog.Description className="mb-4">
                Radix UI Alert Dialog is working correctly! All dependencies have been successfully installed.
              </AlertDialog.Description>
              <div className="flex justify-end gap-2">
                <AlertDialog.Cancel asChild>
                  <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    OK
                  </button>
                </AlertDialog.Action>
              </div>
              <AlertDialog.Cancel asChild>
                <button className="absolute top-2 right-2 p-1">
                  <X className="w-4 h-4" />
                </button>
              </AlertDialog.Cancel>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      </div>

      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
        <p className="text-sm text-green-700">
          ✅ All UI dependencies are working correctly:
        </p>
        <ul className="text-xs text-green-600 mt-1">
          <li>• @radix-ui/react-alert-dialog</li>
          <li>• lucide-react</li>
          <li>• sonner</li>
        </ul>
      </div>
    </div>
  );
}

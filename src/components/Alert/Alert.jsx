import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

const Alert = ({ open, onOpenChange, title, description, type, onConfirm }) => {
  const typeStyles = {
    success: {
      bg: 'bg-green-100 dark:bg-green-800',
      text: 'text-green-800 dark:text-green-100',
      buttonBg: 'bg-green-600',
      buttonHover: 'hover:bg-green-700',
    },
    fail: {
      bg: 'bg-red-100 dark:bg-red-800',
      text: 'text-red-800 dark:text-red-100',
      buttonBg: 'bg-red-600',
      buttonHover: 'hover:bg-red-700',
    },
    delete: {
      bg: 'bg-white dark:bg-red-800',
      text: 'text-black dark:text-red-100',
      buttonBg: 'bg-red-600',
      buttonHover: '',
    },
  };

  const currentType = typeStyles[type] || typeStyles.success;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    onOpenChange(false); // Close the alert
  };


  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Overlay className="fixed inset-0 bg-black/30" />
      <div className={`flex items-center justify-center ${open ? 'fixed inset-0' : ""}`}>
        <AlertDialog.Content className={`rounded-lg p-6 shadow-lg w-80 ${currentType.bg}`}>
          <AlertDialog.Title className={`text-lg font-semibold ${currentType.text}`}>
            {title}
          </AlertDialog.Title>
          <AlertDialog.Description className={`mt-2 text-sm ${currentType.text}`}>
            {description}
          </AlertDialog.Description>
          <div className="mt-4 flex justify-end">
            <AlertDialog.Cancel className="bg-gray-300 dark:bg-gray-600 rounded-md px-4 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500">
              Cancel
            </AlertDialog.Cancel>
            <AlertDialog.Action 
              onClick={handleConfirm} 
              className={`ml-2 rounded-md px-4 py-2 text-sm text-white ${currentType.buttonBg} ${currentType.buttonHover}`}
            >
              Confirm
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </div>
    </AlertDialog.Root>
  );
};

export default Alert;

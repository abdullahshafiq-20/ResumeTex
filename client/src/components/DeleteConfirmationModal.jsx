import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Delete", 
  message = "Are you sure you want to delete this item?",
  itemName = "",
  isDeleting = false
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-xs sm:max-w-md w-full mx-2 sm:mx-4 transform transition-all">
        {/* Header - Compact */}
        <div className="flex items-center justify-between p-2.5 sm:p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            </div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-900">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isDeleting}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Body - Compact */}
        <div className="p-2.5 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            {message}
          </p>
          {itemName && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-2 sm:p-3 mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                "{itemName}"
              </p>
            </div>
          )}
          <p className="text-xs sm:text-sm text-red-600 font-medium">
            This action cannot be undone.
          </p>
        </div>

        {/* Footer - Compact */}
        <div className="flex justify-end space-x-2 sm:space-x-3 p-2.5 sm:p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1.5 sm:space-x-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 
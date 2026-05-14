import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'red' | 'blue' | 'green';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  confirmColor = 'red'
}) => {
  if (!isOpen) return null;

  const colorStyles = {
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Overlay background */}
      <div 
        className="fixed inset-0 transition-opacity bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md p-6 mx-auto my-6 bg-white shadow-xl rounded-2xl z-10">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <button
              className="p-1 ml-auto text-gray-400 bg-transparent border-0 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-600 transition-colors"
              onClick={onClose}
            >
              <span className="block w-6 h-6 text-2xl outline-none focus:outline-none">&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="relative flex-auto mb-6">
            <p className="text-base leading-relaxed text-gray-600">
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-solid border-gray-200 rounded-b">
            <button
              className="px-4 py-2 text-sm font-bold text-gray-600 uppercase transition-all duration-150 ease-linear bg-gray-100 rounded shadow outline-none hover:bg-gray-200 hover:shadow-md focus:outline-none"
              type="button"
              onClick={onClose}
            >
              {cancelText}
            </button>
            <button
              className={`px-4 py-2 text-sm font-bold text-white uppercase transition-all duration-150 ease-linear rounded shadow outline-none hover:shadow-md focus:outline-none ${colorStyles[confirmColor]}`}
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

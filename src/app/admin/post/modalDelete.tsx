import React from "react";

interface ModalConfirmDeleteProps {
  isOpen: boolean;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
  handleClose: () => void;
}

const ModalConfirmDelete: React.FC<ModalConfirmDeleteProps> = ({
  isOpen,
  message = "Bạn có chắc muốn xóa mục này không?",
  onClose,
  onConfirm,
  handleClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 animate-fadeIn">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Xác nhận xóa
        </h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white transition"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmDelete;

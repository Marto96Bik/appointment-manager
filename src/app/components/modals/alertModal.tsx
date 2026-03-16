"use client";

interface AlertModalProps {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AlertModal({
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isOpen,
  onConfirm,
  onCancel,
}: AlertModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel} // Click on the outside closes it
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} // Avoid close inner click
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-amber-100 p-3 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          {description && <p className="text-gray-600 mb-5">{description}</p>}
          <button
            onClick={onConfirm}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition active:scale-95 shadow-lg shadow-red-200 mb-2"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 rounded-xl transition active:scale-95"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}

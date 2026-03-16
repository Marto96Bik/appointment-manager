"use client";

interface ErrorModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export default function ErrorModal({ isOpen, title, message, onClose }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-red-50 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-100 p-3 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-700 mb-2">{title}</h3>
          <p className="text-red-600 mb-5">{message}</p>
          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition active:scale-95 shadow-lg shadow-red-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

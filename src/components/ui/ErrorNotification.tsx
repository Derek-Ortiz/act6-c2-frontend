// Componente de notificación de errores
'use client';

interface ErrorNotificationProps {
  message: string;
  onClose: () => void;
}

export function ErrorNotification({ message, onClose }: ErrorNotificationProps) {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
      <div className="bg-red-900/90 backdrop-blur-sm border border-red-700 rounded-lg p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <h4 className="text-white font-semibold mb-1">Error</h4>
            <p className="text-red-200 text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

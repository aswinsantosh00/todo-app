import { useEffect } from 'react';

function Toast({ message, type = 'info', onClose, isDarkMode }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    info: 'bg-blue-400',
    warning: 'bg-yellow-400',
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideInFromRight">
      <div className={`${colors[type]} border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 min-w-[200px] max-w-[350px]`}>
        <div className="flex justify-between items-start gap-3">
          <p className="text-black font-bold text-sm">{message}</p>
          <button
            onClick={onClose}
            className="text-black font-black hover:scale-110 transition-transform"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default Toast;

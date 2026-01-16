
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center space-x-3 px-6 py-4 rounded-xl shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
    }`}>
      <span className="text-xl">{type === 'success' ? '✓' : '⚠'}</span>
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-70 hover:opacity-100 text-white">✕</button>
    </div>
  );
};

export default Toast;

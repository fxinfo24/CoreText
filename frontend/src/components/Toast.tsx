import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fadeIn max-w-md">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 border border-emerald-400/30">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <p className="text-xs font-bold leading-snug">{message}</p>
      </div>
    </div>
  );
};

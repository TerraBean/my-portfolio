'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

// Create a default context value to avoid the "undefined" error
const defaultToastContext: ToastContextType = {
  showToast: () => {
    console.warn('Toast provider not initialized');
  },
};

const ToastContext = createContext<ToastContextType>(defaultToastContext);

export function useToast() {
  const context = useContext(ToastContext);
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType) => {
    try {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prevToasts) => [...prevToasts, { id, message, type }]);
    } catch (error) {
      console.error('Error showing toast:', error);
    }
  };

  const removeToast = (id: string) => {
    try {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    } catch (error) {
      console.error('Error removing toast:', error);
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem 
              key={toast.id} 
              toast={toast} 
              onClose={() => removeToast(toast.id)} 
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'info':
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-900/20 border-green-500';
      case 'error':
        return 'bg-red-900/20 border-red-500';
      case 'info':
        return 'bg-blue-900/20 border-blue-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      className={`p-4 rounded-lg shadow-lg border ${getBgColor()} min-w-[300px] max-w-md`}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1 text-white">
          {toast.message}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-white transition-colors"
        >
          <FaTimes />
        </button>
      </div>
    </motion.div>
  );
}

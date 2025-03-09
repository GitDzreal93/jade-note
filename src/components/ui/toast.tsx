'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import clsx from 'clsx';

// We'll use heroicons for simplicity
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Toast Types
type ToastType = 'success' | 'error';

// Toast Props Interface
interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

// Toast Context Interface
interface ToastContextProps {
  showToast: (message: string, type: ToastType, duration?: number) => void;
}

// Create Toast Context
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

// Toast Component
const Toast: React.FC<ToastProps> = ({ message, type, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [duration, onClose]);

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={clsx(
        'fixed top-4 right-4 flex items-center p-4 mb-4 max-w-xs rounded-lg shadow z-50 border-l-4',
        getToastStyle()
      )}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 mr-2">
        {getIcon()}
      </div>
      <div className="ml-2 text-sm font-normal">{message}</div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 hover:bg-gray-200 hover:text-gray-900"
        onClick={onClose}
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

// Toast Provider
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType; duration?: number }>>([]);

  const showToast = (message: string, type: ToastType, duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts([...toasts, { id, message, type, duration }]);
  };

  const closeToast = (id: string) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(({ id, message, type, duration }) => (
          <Toast key={id} message={message} type={type} duration={duration} onClose={() => closeToast(id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Hook to use Toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Helper function to create a toast without using context
const createToastElement = (
  message: string, 
  type: ToastType, 
  duration?: number
) => {
  // This ensures the toast component can be rendered on the client-side
  if (typeof window === 'undefined') return;
  
  // Create a temporary div to render the toast
  const div = document.createElement('div');
  document.body.appendChild(div);
  
  // Create React root
  const root = createRoot(div);
  
  const removeToast = () => {
    // Unmount component
    root.unmount();
    // Remove div from DOM
    document.body.removeChild(div);
  };
  
  // Render toast component
  root.render(
    <Toast 
      message={message} 
      type={type} 
      duration={duration} 
      onClose={removeToast} 
    />
  );
};

// Export functions for direct usage
export const showSuccessToast = (message: string, duration?: number) => {
  createToastElement(message, 'success', duration);
};

export const showErrorToast = (message: string, duration?: number) => {
  createToastElement(message, 'error', duration);
};

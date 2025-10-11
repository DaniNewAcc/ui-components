import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type ToastProps = {
  id: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
};

type ToastContextProps = {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextProps | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback((toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastProps = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast]
  );

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
};

const Toast = () => {
  return <div></div>;
};

export default Toast;

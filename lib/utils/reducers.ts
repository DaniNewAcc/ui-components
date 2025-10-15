import { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastRenderProps = {
  id: string;
  onClose: () => void;
  onPause: () => void;
  onResume: () => void;
};

type ToastContent = ReactNode | ((helpers: ToastRenderProps) => ReactNode);

export type ToastData = {
  id: string;
  type?: ToastType;
  content: ToastContent;
  duration?: number;
  isOpen?: boolean;
};

export type ToastAction =
  | { type: 'ADD'; toast: ToastData }
  | { type: 'CLOSE'; id: string }
  | { type: 'REMOVE'; id: string };

export function toastReducer(state: ToastData[], action: ToastAction): ToastData[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.toast];
    case 'CLOSE':
      return state.map(toast => (toast.id === action.id ? { ...toast, isOpen: false } : toast));
    case 'REMOVE':
      return state.filter(toast => toast.id !== action.id);
    default:
      return state;
  }
}

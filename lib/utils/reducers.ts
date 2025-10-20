import { ReactNode } from 'react';

export type ToastRenderProps = {
  id: string;
  onClose: () => void;
  onExited?: () => void;
  onPause: () => void;
  onResume: () => void;
};

type ToastContent = ReactNode | ((helpers: ToastRenderProps) => ReactNode);

export type ToastData = {
  id: string;
  content: ToastContent;
  duration?: number;
  isOpen?: boolean;
};

export type ToastAction =
  | { type: 'ADD'; toast: ToastData }
  | { type: 'OPEN'; id: string }
  | { type: 'CLOSE'; id: string }
  | { type: 'REMOVE'; id: string };

export function toastReducer(state: ToastData[], action: ToastAction): ToastData[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.toast];
    case 'OPEN':
      return state.map(toast => (toast.id === action.id ? { ...toast, isOpen: true } : toast));
    case 'CLOSE':
      return state.map(toast => (toast.id === action.id ? { ...toast, isOpen: false } : toast));
    case 'REMOVE':
      return state.filter(toast => toast.id !== action.id);
    default:
      return state;
  }
}

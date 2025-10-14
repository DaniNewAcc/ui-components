export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type ToastData = {
  id: string;
  type?: ToastType;
  title?: string;
  message?: string;
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

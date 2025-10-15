import Portal from '@components/Portal';
import { ToastData, toastReducer, ToastRenderProps } from '@utils/reducers';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';

type TimerData = {
  timerId: NodeJS.Timeout;
  start: number;
  remaining: number;
};

type ToastProps = ToastData & ToastRenderProps;

type ToastContextProps = {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, 'id'>) => void;
  closeToast: (id: string) => void;
  pauseTimer: (id: string) => void;
  resumeTimer: (id: string) => void;
};

const ToastContext = createContext<ToastContextProps | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const timersRef = useRef<Record<string, TimerData>>({});

  const ANIMATION_DURATION = 300;

  const clearTimer = (id: string) => {
    const timerData = timersRef.current[id];
    if (timerData) {
      clearTimeout(timerData.timerId);
      delete timersRef.current[id];
    }
  };

  const startCloseTimer = (id: string, duration: number) => {
    const start = Date.now();
    const timerId = setTimeout(() => {
      dispatch({ type: 'CLOSE', id });

      const removeTimer = setTimeout(() => {
        dispatch({ type: 'REMOVE', id });
        delete timersRef.current[id];
      }, ANIMATION_DURATION);

      timersRef.current[id] = {
        timerId: removeTimer,
        start: Date.now(),
        remaining: ANIMATION_DURATION,
      };
    }, duration);

    timersRef.current[id] = {
      timerId,
      start,
      remaining: duration,
    };
  };

  const addToast = useCallback((toast: Omit<ToastData, 'id' | 'isOpen'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? 5000;

    dispatch({ type: 'ADD', toast: { ...toast, id, isOpen: true } });

    startCloseTimer(id, duration);
  }, []);

  const closeToast = useCallback((id: string) => {
    clearTimer(id);

    dispatch({ type: 'CLOSE', id });

    const removeTimer = setTimeout(() => {
      dispatch({ type: 'REMOVE', id });
      delete timersRef.current[id];
    }, ANIMATION_DURATION);

    timersRef.current[id] = {
      timerId: removeTimer,
      start: Date.now(),
      remaining: ANIMATION_DURATION,
    };
  }, []);

  const pauseTimer = useCallback((id: string) => {
    const timerData = timersRef.current[id];
    if (timerData) {
      clearTimeout(timerData.timerId);

      const elapsed = Date.now() - timerData.start;
      const remaining = timerData.remaining - elapsed;

      timersRef.current[id] = {
        ...timerData,
        remaining: remaining > 0 ? remaining : 0,
      };
    }
  }, []);

  const resumeTimer = useCallback((id: string) => {
    const timerData = timersRef.current[id];
    if (timerData && timerData.remaining > 0) {
      startCloseTimer(id, timerData.remaining);
    }
  }, []);

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(timerData => clearTimeout(timerData.timerId));
      timersRef.current = {};
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      toasts,
      addToast,
      closeToast,
      pauseTimer,
      resumeTimer,
    }),
    [toasts, addToast, closeToast, pauseTimer, resumeTimer]
  );

  return <ToastContext.Provider value={contextValue}>{children}</ToastContext.Provider>;
};

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used in <ToastProvider>.');
  }

  return context;
}

const Toast = ({ id, content, isOpen = true, onClose, onPause, onResume }: ToastProps) => {
  const animationDuration = 300;
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const enterTimer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(enterTimer);
  }, []);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className="ui:pointer-events-auto ui:overflow-hidden ui:ease-out"
      style={{
        opacity: isVisible && isOpen ? 1 : 0,
        transform: isVisible && isOpen ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${animationDuration}ms ease, transform ${animationDuration}ms ease`,
      }}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onTouchStart={onPause}
      onTouchEnd={onResume}
    >
      {typeof content === 'function' ? content({ id, onClose, onPause, onResume }) : content}
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, closeToast, pauseTimer, resumeTimer } = useToast();

  return (
    <Portal>
      <div
        aria-live="polite"
        className="ui:scrollbar-hide ui:pointer-events-none ui:fixed ui:right-4 ui:bottom-4 ui:flex ui:h-[500px] ui:max-h-[70vh] ui:flex-col-reverse ui:items-end ui:gap-3 ui:overflow-x-hidden ui:overflow-y-auto"
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => closeToast(toast.id)}
            onPause={() => pauseTimer(toast.id)}
            onResume={() => resumeTimer(toast.id)}
          />
        ))}
      </div>
    </Portal>
  );
};

Toast.Container = ToastContainer;
ToastContainer.displayName = 'ToastContainer';

export default Toast;

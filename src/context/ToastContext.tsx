import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Check, Heart, Info, X } from "lucide-react";

type ToastTone = "success" | "info" | "favorite";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  notify: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const VISIBLE_MS = 2600;

const TONE_ICON: Record<ToastTone, ReactNode> = {
  success: <Check size={15} />,
  info: <Info size={15} />,
  favorite: <Heart size={15} className="fill-current" />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);
  const timers = useRef<number[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, tone: ToastTone = "success") => {
      nextId.current += 1;
      const id = nextId.current;
      // Cap the stack so rapid clicking can't bury the screen.
      setToasts((current) => [...current.slice(-2), { id, message, tone }]);
      timers.current.push(
        window.setTimeout(() => dismiss(id), VISIBLE_MS),
      );
    },
    [dismiss],
  );

  // Clear pending timers if the provider unmounts mid-flight.
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* aria-live announces new toasts without stealing focus */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[80] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-6 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-[0_12px_32px_rgba(37,28,24,0.18)] sm:w-auto"
          >
            <span
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${
                toast.tone === "favorite"
                  ? "bg-brand/10 text-brand"
                  : toast.tone === "info"
                    ? "bg-brand-soft text-concrete"
                    : "bg-green-100 text-green-700"
              }`}
            >
              {TONE_ICON[toast.tone]}
            </span>

            <p className="flex-1 text-sm font-semibold text-navy">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss"
              className="text-concrete transition hover:text-navy"
            >
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}

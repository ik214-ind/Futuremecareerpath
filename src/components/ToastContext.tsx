import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'info') => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl glass-card px-4 py-3.5 shadow-2xl animate-slideInRight min-w-[280px] max-w-[400px]"
            style={{ borderColor: toast.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(129, 140, 248, 0.3)' }}
          >
            <div
              className="flex-shrink-0 rounded-lg p-1.5"
              style={{
                background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(129, 140, 248, 0.15)',
              }}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Info className="w-4 h-4 text-indigo-400" />
              )}
            </div>
            <p className="text-sm text-slate-200 flex-1 leading-snug">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

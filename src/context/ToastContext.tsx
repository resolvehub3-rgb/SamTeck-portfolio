import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X, 
  Mail, 
  Sparkles 
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'email';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  success: (title: string, message?: string) => string;
  error: (title: string, message?: string) => string;
  info: (title: string, message?: string) => string;
  warning: (title: string, message?: string) => string;
  emailAlert: (title: string, message?: string, onOpen?: () => void) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastItem = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? (toast.type === 'email' ? 7000 : 4000);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    return showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    return showToast({ type: 'error', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    return showToast({ type: 'info', title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    return showToast({ type: 'warning', title, message });
  }, [showToast]);

  const emailAlert = useCallback((title: string, message?: string, onOpen?: () => void) => {
    return showToast({ 
      type: 'email', 
      title, 
      message, 
      duration: 8000,
      action: onOpen ? { label: 'View Message', onClick: onOpen } : undefined 
    });
  }, [showToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          border: 'border-emerald-500/40',
          bg: 'bg-[#031526]/95',
          accent: 'text-emerald-400',
          glow: 'shadow-emerald-500/15',
          icon: CheckCircle2,
          progressBg: 'bg-emerald-400',
        };
      case 'error':
        return {
          border: 'border-rose-500/40',
          bg: 'bg-[#18081A]/95',
          accent: 'text-rose-400',
          glow: 'shadow-rose-500/15',
          icon: AlertCircle,
          progressBg: 'bg-rose-400',
        };
      case 'warning':
        return {
          border: 'border-amber-500/40',
          bg: 'bg-[#1A1205]/95',
          accent: 'text-amber-400',
          glow: 'shadow-amber-500/15',
          icon: AlertTriangle,
          progressBg: 'bg-amber-400',
        };
      case 'email':
        return {
          border: 'border-[#FF6A00]/60',
          bg: 'bg-[#0D153A]/98',
          accent: 'text-[#FF6A00]',
          glow: 'shadow-[#FF6A00]/25',
          icon: Mail,
          progressBg: 'bg-[#FF6A00]',
        };
      case 'info':
      default:
        return {
          border: 'border-blue-500/40',
          bg: 'bg-[#041235]/95',
          accent: 'text-blue-400',
          glow: 'shadow-blue-500/15',
          icon: Info,
          progressBg: 'bg-blue-400',
        };
    }
  };

  return (
    <ToastContext.Provider
      value={{
        showToast,
        success,
        error,
        info,
        warning,
        emailAlert,
        removeToast,
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <div 
        id="toast-notification-container"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full px-4 sm:px-0 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);
            const Icon = styles.icon;
            const duration = toast.duration ?? (toast.type === 'email' ? 7000 : 4000);

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: 15, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} backdrop-blur-xl p-4 shadow-2xl ${styles.glow} text-white flex flex-col gap-2`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-1.5 rounded-lg bg-white/5 ${styles.accent} shrink-0 mt-0.5`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold font-heading text-white leading-tight">
                        {toast.title}
                      </h4>
                      {toast.message && (
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-3">
                          {toast.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeToast(toast.id)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Optional Action Button */}
                {toast.action && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => {
                        toast.action?.onClick();
                        removeToast(toast.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#FF6A00] hover:bg-[#e55a00] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{toast.action.label}</span>
                    </button>
                  </div>
                )}

                {/* Animated Dismiss Progress Bar */}
                {duration > 0 && (
                  <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                    className={`absolute bottom-0 left-0 h-0.5 ${styles.progressBg} opacity-60`}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

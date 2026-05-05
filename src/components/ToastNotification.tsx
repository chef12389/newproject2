import { useState, createContext, useContext, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, XCircle, Info, AlertCircle } from 'lucide-react'
import { hoverLift, tapPress, toastVariants } from '@/lib/motion'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | null>(null)
let toastBridge: ToastContextType | null = null

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

const TOAST_ICONS = {
  success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-blue-500" />,
  warning: <AlertCircle className="h-5 w-5 text-amber-500" />,
}

const TOAST_STYLES = {
  success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  error: 'bg-red-500/10 border-red-500/30 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  info: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  warning: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
    const newToast: Toast = {
      id,
      ...toast,
      duration: toast.duration ?? 4000,
    }

    setToasts((prev) => [...prev, newToast])

    if (newToast.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, newToast.duration)
    }
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  toastBridge = { toasts, addToast, removeToast, clearAll }

  return <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>{children}</ToastContext.Provider>
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast()

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center p-4 md:items-end md:justify-end"
      role="region"
      aria-label="Toast notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={toastVariants}
            className="pointer-events-auto mb-3 max-w-sm w-full"
            role={toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status'}
            aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
            aria-atomic="true"
          >
            <div className={cn('surface-card-strong overflow-hidden rounded-2xl border-2 p-4 shadow-2xl', TOAST_STYLES[toast.type])}>
              <div className="flex gap-3">
                <div className="mt-0.5 flex-none">{TOAST_ICONS[toast.type]}</div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold">{toast.title}</h4>
                    <motion.button
                      onClick={() => removeToast(toast.id)}
                      className="flex-none rounded-full p-1 transition-colors hover:bg-black/5"
                      aria-label={`关闭通知：${toast.title}`}
                      whileHover={hoverLift}
                      whileTap={tapPress}
                    >
                      <X className="h-4 w-4" />
                    </motion.button>
                  </div>

                  {toast.message && <p className="mt-1 text-sm leading-5">{toast.message}</p>}

                  {toast.action && (
                    <motion.button
                      whileHover={hoverLift}
                      whileTap={tapPress}
                      onClick={toast.action.onClick}
                      className="mt-3 w-full rounded-xl bg-current/10 px-4 py-2 text-sm font-semibold transition-colors hover:bg-current/20"
                    >
                      {toast.action.label}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function toast(options: Omit<Toast, 'id'>) {
  if (!toastBridge) {
    console.warn('toast() must be used within ToastProvider')
    return
  }
  toastBridge.addToast(options)
}

export function toastSuccess(title: string, message?: string, duration?: number) {
  if (!toastBridge) {
    console.warn('toastSuccess() must be used within ToastProvider')
    return
  }
  toastBridge.addToast({ type: 'success', title, message, duration })
}

export function toastError(title: string, message?: string, duration?: number) {
  if (!toastBridge) {
    console.warn('toastError() must be used within ToastProvider')
    return
  }
  toastBridge.addToast({ type: 'error', title, message, duration })
}

export function toastInfo(title: string, message?: string, duration?: number) {
  if (!toastBridge) {
    console.warn('toastInfo() must be used within ToastProvider')
    return
  }
  toastBridge.addToast({ type: 'info', title, message, duration })
}

export function toastWarning(title: string, message?: string, duration?: number) {
  if (!toastBridge) {
    console.warn('toastWarning() must be used within ToastProvider')
    return
  }
  toastBridge.addToast({ type: 'warning', title, message, duration })
}

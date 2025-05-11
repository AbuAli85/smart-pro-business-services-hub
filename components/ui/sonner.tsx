"use client"

import * as React from "react"

// Simple utility function instead of importing cn from utils
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" ")

// Define a simplified toast component that doesn't rely on external libraries
// This will be a placeholder until the actual Sonner library is properly integrated

type ToastProps = {
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
  duration?: number
  onClose?: () => void
}

type ToastContextType = {
  toast: (props: ToastProps) => void
  dismiss: (id?: string) => void
}

const ToastContext = React.createContext<ToastContextType>({
  toast: () => {},
  dismiss: () => {},
})

export function useToast() {
  return React.useContext(ToastContext)
}

export function Toaster({
  position = "bottom-right",
  theme = "system",
  closeButton = true,
  ...props
}: {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center"
  theme?: "light" | "dark" | "system"
  closeButton?: boolean
  [key: string]: any
}) {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>([])

  // Position styles
  const positionStyles: Record<string, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
    "top-center": "top-0 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-0 left-1/2 -translate-x-1/2",
  }

  const addToast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])

    // Auto dismiss
    if (props.duration !== Number.POSITIVE_INFINITY) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, props.duration || 5000)
    }
  }, [])

  const dismissToast = React.useCallback((id?: string) => {
    setToasts((prev) => (id ? prev.filter((toast) => toast.id !== id) : []))
  }, [])

  const contextValue = React.useMemo(
    () => ({
      toast: addToast,
      dismiss: dismissToast,
    }),
    [addToast, dismissToast],
  )

  return (
    <ToastContext.Provider value={contextValue}>
      {props.children}
      <div className={cn("fixed z-50 flex flex-col gap-2 w-full max-w-sm p-4", positionStyles[position])}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "bg-background border rounded-lg shadow-lg p-4 transition-all",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-80 data-[state=open]:fade-in-0",
              toast.variant === "destructive" && "border-destructive bg-destructive text-destructive-foreground",
              toast.variant === "success" && "border-green-500 bg-green-500/10",
            )}
            data-state="open"
          >
            <div className="flex justify-between items-start gap-2">
              <div className="grid gap-1">
                {toast.title && <div className="font-semibold">{toast.title}</div>}
                {toast.description && <div className="text-sm opacity-90">{toast.description}</div>}
              </div>
              {closeButton && (
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="rounded-md p-1 text-foreground/50 hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
            {toast.action && <div className="mt-2">{toast.action}</div>}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

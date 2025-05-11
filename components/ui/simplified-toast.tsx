"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  className?: string
  variant?: "default" | "destructive"
  children?: React.ReactNode
  title?: string
  description?: string
  action?: React.ReactNode
  onClose?: () => void
}

interface ToastActionProps {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
}

interface ToastProviderProps {
  children: React.ReactNode
}

interface ToastViewportProps {
  className?: string
}

interface ToastTitleProps {
  className?: string
  children?: React.ReactNode
}

interface ToastDescriptionProps {
  className?: string
  children?: React.ReactNode
}

interface ToastCloseProps {
  className?: string
  onClick?: () => void
}

type ToastContextType = {
  toasts: Array<{
    id: string
    title?: string
    description?: string
    action?: React.ReactNode
    variant?: "default" | "destructive"
    onClose?: () => void
  }>
  addToast: (toast: Omit<ToastProps, "className" | "children">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastContextType["toasts"]>([])

  const addToast = React.useCallback((toast: Omit<ToastProps, "className" | "children">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

export function ToastViewport({ className }: ToastViewportProps) {
  const { toasts } = React.useContext(ToastContext)

  if (toasts.length === 0) return null

  return (
    <div
      className={cn(
        "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
        className,
      )}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          action={toast.action}
          variant={toast.variant}
          onClose={() => {
            if (toast.onClose) toast.onClose()
            // const { removeToast } = React.useContext(ToastContext) // Removed useContext here
            // removeToast(toast.id)
          }}
          toastId={toast.id} // Pass the toast ID as a prop
        />
      ))}
    </div>
  )
}

export function Toast({
  className,
  variant = "default",
  children,
  title,
  description,
  action,
  onClose,
  toastId, // Receive the toast ID as a prop
}: ToastProps & { toastId: string }) {
  const { removeToast } = React.useContext(ToastContext) // Call useContext at the top level

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    removeToast(toastId) // Use the removeToast function from the context
  }

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full mt-4",
        variant === "default" && "border bg-background text-foreground",
        variant === "destructive" && "destructive group border-destructive bg-destructive text-destructive-foreground",
        className,
      )}
    >
      <div className="grid gap-1">
        {title && <ToastTitle>{title}</ToastTitle>}
        {description && <ToastDescription>{description}</ToastDescription>}
        {children}
      </div>
      {action}
      <ToastClose onClick={handleClose} />
    </div>
  )
}

export function ToastAction({ className, children, onClick }: ToastActionProps) {
  return (
    <button
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function ToastTitle({ className, children }: ToastTitleProps) {
  return <div className={cn("text-sm font-semibold", className)}>{children}</div>
}

export function ToastDescription({ className, children }: ToastDescriptionProps) {
  return <div className={cn("text-sm opacity-90", className)}>{children}</div>
}

export function ToastClose({ className, onClick }: ToastCloseProps) {
  return (
    <button
      className={cn(
        "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
        className,
      )}
      onClick={onClick}
    >
      <X className="h-4 w-4" />
    </button>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    toast: context.addToast,
    dismiss: context.removeToast,
    toasts: context.toasts,
  }
}

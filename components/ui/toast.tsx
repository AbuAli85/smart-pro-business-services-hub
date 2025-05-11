"use client"
import {
  Toast as SimplifiedToast,
  ToastAction as SimplifiedToastAction,
  ToastClose as SimplifiedToastClose,
  ToastDescription as SimplifiedToastDescription,
  ToastProvider as SimplifiedToastProvider,
  ToastTitle as SimplifiedToastTitle,
  ToastViewport as SimplifiedToastViewport,
} from "./simplified-toast"

const ToastProvider = SimplifiedToastProvider
const ToastViewport = SimplifiedToastViewport
const Toast = SimplifiedToast
const ToastTitle = SimplifiedToastTitle
const ToastDescription = SimplifiedToastDescription
const ToastClose = SimplifiedToastClose
const ToastAction = SimplifiedToastAction

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction }

export type {
  ToastProps,
  ToastActionElement,
} from "./simplified-toast"

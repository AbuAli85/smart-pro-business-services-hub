import { useToast as useToastOriginal } from "./simplified-toast"

// Re-export the useToast hook
export const useToast = useToastOriginal

// Also export the toast function for direct imports
export const toast = (props: any) => {
  // This is a fallback for direct imports
  // Ideally, components should use the useToast hook
  console.warn("Direct toast import used. Consider using the useToast hook instead.")

  // Create a simple implementation that logs to console if used directly
  console.log("Toast:", props)
  return props
}

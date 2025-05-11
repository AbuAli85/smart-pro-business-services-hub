import { supabase } from "@/lib/supabase/client"

/**
 * Error types that can be handled
 */
export type AuthErrorType = 
  | "invalid_refresh_token" 
  | "expired_token" 
  | "session_not_found"
  | "auth_session_missing"
  | "unknown"

/**
 * Parses an error message to determine the type of auth error
 */
export function parseAuthError(error: any): AuthErrorType {
  const errorMessage = error?.message?.toLowerCase() || ""
  
  if (errorMessage.includes("refresh token not found") || errorMessage.includes("invalid refresh token")) {
    return "invalid_refresh_token"
  }
  
  if (errorMessage.includes("expired")) {
    return "expired_token"
  }
  
  if (errorMessage.includes("session not found")) {
    return "session_not_found"
  }
  
  if (errorMessage.includes("auth session missing")) {
    return "auth_session_missing"
  }
  
  return "unknown"
}

/**
 * Cleans up the auth state when an error occurs
 */
export async function handleAuthError(error: any): Promise<void> {
  console.error("Auth error:", error)
  
  const errorType = parseAuthError(error)
  
  // For these error types, we should clear the local session
  if (
    errorType === "invalid_refresh_token" || 
    errorType === "expired_token" || 
    errorType === "session_not_found" ||
    errorType === "auth_session_missing"
  ) {
    // Clear local storage auth data
    if (typeof window !== "undefined") {
      // Clear Supabase-specific items
      const keysToRemove = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && (
          key.startsWith("sb-") || 
          key.startsWith("supabase") || 
          key.includes("auth") ||
          key.includes("smartpro")
        )) {
          keysToRemove.push(key)
        }
      }
      
      // Remove the collected keys
      keysToRemove.forEach(key => localStorage.removeItem(key))
      
      // Also try to sign out from Supabase to clear server-side session
      try {
        await supabase.auth.signOut()
      } catch (signOutError) {
        console.error("Error during sign out:", signOutError)
      }
    }
  }
}

/**
 * Attempts to recover from an auth error
 * Returns true if recovery was successful
 */
export async function recoverFromAuthError(error: any): Promise<boolean> {
  const errorType = parseAuthError(error)
  
  // Handle based on error type
  switch (errorType) {
    case "invalid_refresh_token":
    case "expired_token":
    case "session_not_found":
    case "auth_session_missing":
      // Clear the invalid session
      await handleAuthError(error)
      
      // For these errors, we can't recover automatically
      return false
      
    case "unknown":
    default:
      // For unknown errors, we can't do much
      console.error("Unknown auth error:", error)
      return false
  }
}

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"
import { handleAuthError } from "@/lib/auth/auth-error-handler"

export function SessionRecoveryHandler() {
  const [hasError, setHasError] = useState(false)
  const [isRecovering, setIsRecovering] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for auth errors in localStorage
    const checkForAuthErrors = () => {
      const hasAuthError = localStorage.getItem("auth_error")
      if (hasAuthError) {
        setHasError(true)
        // Clear the error flag
        localStorage.removeItem("auth_error")
      }
    }

    checkForAuthErrors()

    // Listen for storage events (in case another tab sets the auth_error)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_error" && e.newValue) {
        setHasError(true)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleRecovery = async () => {
    setIsRecovering(true)
    try {
      // Clear any invalid auth state
      await handleAuthError({ message: "manual_recovery" })

      // Redirect to login
      router.push("/auth/login")
    } catch (error) {
      console.error("Recovery failed:", error)
    } finally {
      setIsRecovering(false)
      setHasError(false)
    }
  }

  if (!hasError) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Session Error</AlertTitle>
          <AlertDescription>
            We detected an issue with your authentication session. This could be due to an expired session or browser
            storage issues.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-2">
          <Button onClick={handleRecovery} disabled={isRecovering} className="w-full">
            {isRecovering ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Recovering...
              </>
            ) : (
              "Fix Session & Sign In Again"
            )}
          </Button>

          <Button variant="outline" onClick={() => setHasError(false)} className="w-full">
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { type ReactNode, useEffect } from "react"
import { useRoleAuth, type UserRole } from "@/hooks/use-role-auth"
import { useRouter } from "next/navigation"

interface RoleBasedLayoutProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
  redirectPath?: string
}

// Export as both default and named export for compatibility
export function RoleBasedLayout({
  children,
  allowedRoles,
  fallback,
  redirectPath = "/auth/login",
}: RoleBasedLayoutProps) {
  const { role, isLoading, isAuthorized } = useRoleAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect in production environment
    if (!isLoading && !isAuthorized && process.env.NODE_ENV !== "development") {
      router.push(redirectPath)
    }
  }, [isLoading, isAuthorized, redirectPath, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // In development, show a warning but allow access
  if (!isAuthorized && process.env.NODE_ENV === "development") {
    console.warn("User not authorized, but allowing access in development mode")
    return (
      <>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Development Mode:</strong> You don't have permission to access this page (Role: {role || "none"}
                , Required: {allowedRoles.join(", ")})
              </p>
            </div>
          </div>
        </div>
        {children}
      </>
    )
  }

  // Show fallback content if provided and user is not authorized
  if (!isAuthorized && fallback) {
    return <>{fallback}</>
  }

  // Show the actual content if user is authorized
  return <>{children}</>
}

// Also export as default for compatibility
export default RoleBasedLayout

"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { checkAuth, getUserRole, getDashboardByRole } from "@/lib/auth/client-auth"

interface ClientProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
  fallback?: ReactNode
}

export function ClientProtectedRoute({
  children,
  allowedRoles = [],
  fallback = (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
}: ClientProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Check if the user is authenticated
        const { isAuthenticated, session } = await checkAuth()

        // If not authenticated, redirect to login
        if (!isAuthenticated) {
          const returnUrl = encodeURIComponent(window.location.pathname)
          router.push(`/auth/login?redirectTo=${returnUrl}`)
          return
        }

        // If we need to check roles
        if (allowedRoles.length > 0) {
          const role = await getUserRole()

          // If user doesn't have an allowed role, redirect to their dashboard
          if (!role || !allowedRoles.includes(role)) {
            router.push(getDashboardByRole(role))
            return
          }
        }

        // User is authorized
        setIsAuthorized(true)
      } catch (error) {
        console.error("Protected route error:", error)
        setIsAuthorized(false)
      }
    }

    checkAuthorization()
  }, [allowedRoles, router])

  // Show fallback while checking authorization
  if (isAuthorized === null) {
    return <>{fallback}</>
  }

  // Show children if authorized
  if (isAuthorized) {
    return <>{children}</>
  }

  // This should not be reached as we redirect in the effect
  return null
}

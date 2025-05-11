"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { getDashboardByRole } from "@/lib/auth/auth-redirect"

export function useAuthRedirect(
  options: {
    whenAuthenticated?: boolean
    whenUnauthenticated?: boolean
    allowedRoles?: string[]
    redirectTo?: string
  } = {},
) {
  const { whenAuthenticated = false, whenUnauthenticated = false, allowedRoles = [], redirectTo } = options

  const { isAuthenticated, loading, role } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip if still loading
    if (loading) return

    // Redirect authenticated users if needed
    if (isAuthenticated && whenAuthenticated) {
      const destination = redirectTo || getDashboardByRole(role)
      router.push(destination)
      return
    }

    // Redirect unauthenticated users if needed
    if (!isAuthenticated && whenUnauthenticated) {
      const destination = redirectTo || `/auth/login?redirectTo=${encodeURIComponent(pathname)}`
      router.push(destination)
      return
    }

    // Check role-based access if needed
    if (isAuthenticated && allowedRoles.length > 0) {
      if (!role || !allowedRoles.includes(role)) {
        router.push(getDashboardByRole(role))
      }
    }
  }, [
    isAuthenticated,
    loading,
    role,
    router,
    pathname,
    whenAuthenticated,
    whenUnauthenticated,
    allowedRoles,
    redirectTo,
  ])
}

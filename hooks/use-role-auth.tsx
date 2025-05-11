"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

// Define user roles
export type UserRole = "admin" | "provider" | "client" | null

// Define the context shape
interface RoleAuthContextType {
  role: UserRole
  isLoading: boolean
  isAuthorized: boolean
  checkAccess: (allowedRoles: UserRole[]) => boolean
  userId: string | null
}

// Create context with default values
const RoleAuthContext = createContext<RoleAuthContextType>({
  role: null,
  isLoading: true,
  isAuthorized: false,
  checkAccess: () => false,
  userId: null,
})

// Hook to use the role auth context
export const useRoleAuth = () => useContext(RoleAuthContext)

interface RoleAuthProviderProps {
  children: ReactNode
  defaultRole?: UserRole
  requiredRoles?: UserRole[]
  redirectUnauthorized?: string
}

export const RoleAuthProvider = ({
  children,
  defaultRole = "client",
  requiredRoles = ["admin", "provider", "client"],
  redirectUnauthorized = "/auth/login",
}: RoleAuthProviderProps) => {
  const [role, setRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  // Check if a user has access based on their role
  const checkAccess = (allowedRoles: UserRole[]) => {
    if (!role) return false
    return allowedRoles.includes(role)
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If Supabase is not configured or in development, use demo mode
        if (!isSupabaseConfigured() || process.env.NODE_ENV === "development") {
          console.log(`Using demo mode with ${defaultRole} role (Supabase not configured or in development)`)
          setRole(defaultRole)
          setUserId("demo-user-id")
          setIsAuthorized(requiredRoles.includes(defaultRole))
          setIsLoading(false)
          return
        }

        // Get current user from Supabase
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Auth error:", userError)
          throw userError
        }

        // If no user, redirect to login
        if (!user) {
          setRole(null)
          setIsAuthorized(false)
          if (redirectUnauthorized) {
            router.push(redirectUnauthorized)
          }
          setIsLoading(false)
          return
        }

        setUserId(user.id)

        try {
          // Get user role from profiles table
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single()

          if (profileError) {
            // If profile doesn't exist, use default role
            console.warn("Profile not found, using default role:", defaultRole)
            setRole(defaultRole)
          } else {
            setRole(profile.role as UserRole)
          }

          // Check if user is authorized
          const authorized = profile
            ? requiredRoles.includes(profile.role as UserRole)
            : requiredRoles.includes(defaultRole)
          setIsAuthorized(authorized)

          if (!authorized) {
            console.log(`User with role ${profile?.role || defaultRole} is not authorized to access this page`)
            if (redirectUnauthorized && process.env.NODE_ENV !== "development") {
              router.push(redirectUnauthorized)
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          // Fallback to default role
          setRole(defaultRole)
          setIsAuthorized(requiredRoles.includes(defaultRole))
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Fallback to default role in development
        if (process.env.NODE_ENV === "development") {
          setRole(defaultRole)
          setUserId("demo-user-id")
          setIsAuthorized(requiredRoles.includes(defaultRole))
        } else {
          setRole(null)
          setIsAuthorized(false)
          if (redirectUnauthorized) {
            router.push(redirectUnauthorized)
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [defaultRole, requiredRoles, redirectUnauthorized, router])

  return (
    <RoleAuthContext.Provider value={{ role, isLoading, isAuthorized, checkAccess, userId }}>
      {children}
    </RoleAuthContext.Provider>
  )
}

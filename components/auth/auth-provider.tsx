"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { getAuthService } from "@/lib/auth/auth-service-factory"
import { RateLimitWarning } from "@/components/auth/rate-limit-warning"
import { getDashboardByRole } from "@/lib/auth/client-auth-utils"
import { handleAuthError, recoverFromAuthError } from "@/lib/auth/auth-error-handler"

// Create a type for the auth context
type AuthContextType = {
  user: any | null
  session: any | null
  profile: any | null
  loading: boolean
  error: Error | null
  isAuthenticated: boolean
  role: string | null
  signIn: (email: string, password: string, redirectPath?: string) => Promise<any>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}

// Create the auth context
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  error: null,
  isAuthenticated: false,
  role: null,
  signIn: async () => ({}),
  signOut: async () => {},
  refreshSession: async () => {},
})

// Create a hook to use the auth context
export const useAuth = () => useContext(AuthContext)

// Create the auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Get the auth service (real or mock based on environment)
  const authService = getAuthService()

  // Function to get user profile
  const getUserProfile = async (userId: string) => {
    try {
      const { createClient } = await import("@/lib/auth/client-auth-utils")
      const supabase = createClient()

      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  // Function to get user role from profile
  const getUserRole = async (userId: string) => {
    try {
      const profile = await getUserProfile(userId)
      return profile?.role || null
    } catch (error) {
      console.error("Error fetching user role:", error)
      return null
    }
  }

  // Function to sign in with email and password
  const signIn = async (email: string, password: string, redirectPath?: string) => {
    try {
      const result = await authService.signInWithPassword(email, password)

      if (result.data?.user) {
        // Get user role
        const userRole = await getUserRole(result.data.user.id)
        setRole(userRole)

        // Get user profile
        const userProfile = await getUserProfile(result.data.user.id)
        setProfile(userProfile)

        // Determine where to redirect
        const destination = redirectPath || searchParams?.get("redirectTo") || getDashboardByRole(userRole)

        // Use router for navigation
        setTimeout(() => {
          router.push(destination)
        }, 500)
      }

      return result
    } catch (error: any) {
      console.error("Error signing in:", error)

      // Show rate limit warning if needed
      if (error?.status === 429) {
        setShowRateLimitWarning(true)
      }

      throw error
    }
  }

  // Function to sign out
  const signOut = async () => {
    try {
      await authService.signOut()
      router.push("/auth/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      setLoading(true)
      const { data, error } = await authService.getSession()

      if (error) {
        await handleAuthError(error)
        throw error
      }

      setSession(data.session)
      setUser(data.session?.user || null)

      if (data.session?.user) {
        const userRole = await getUserRole(data.session.user.id)
        setRole(userRole)

        const userProfile = await getUserProfile(data.session.user.id)
        setProfile(userProfile)
      }
      
      return { success: true }
    } catch (error) {
      console.error("Error refreshing session:", error)
      await handleAuthError(error)
      return { success: false, error }
    } finally {
      setLoading(false)
    }
  }

  // Effect to get the initial session and set up auth state listener
  useEffect(() => {
    let mounted = true
    let authListener: any = null

    async function getInitialSession() {
      try {
        setLoading(true)
        const { data, error } = await authService.getSession()

        if (mounted) {
          if (error) {
            // Handle auth errors
            await handleAuthError(error)
            
            // Show rate limit warning if needed
            if (error?.status === 429) {
              setShowRateLimitWarning(true)
            }

            setError(error)
          } else {
            setSession(data.session)
            setUser(data.session?.user || null)

            // Get user role and profile if we have a user
            if (data.session?.user) {
              const userRole = await getUserRole(data.session.user.id)
              setRole(userRole)

              const userProfile = await getUserProfile(data.session.user.id)
              setProfile(userProfile)
            }
          }
        }
      } catch (error: any) {
        if (mounted) {
          // Handle auth errors
          await handleAuthError(error)
          
          // Show rate limit warning if needed
          if (error?.status === 429) {
            setShowRateLimitWarning(true)
          }

          setError(error instanceof Error ? error : new Error("Unknown error"))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    // Set up auth state listener
    try {
      const { data } = authService.onAuthStateChange(async (event, session) => {
        if (mounted) {
          setSession(session)
          setUser(session?.user || null)

          // Get user role and profile if we have a user
          if (session?.user) {
            const userRole = await getUserRole(session.user.id)
            setRole(userRole)

            const userProfile = await getUserProfile(session.user.id)
            setProfile(userProfile)
          } else {
            setRole(null)
            setProfile(null)
          }

          setLoading(false)
        }
      })

      authListener = data
    } catch (error) {
      console.error("Error setting up auth listener:", error)
    }

    return () => {
      mounted = false
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  // Provide the auth context
  return (
    <>
      {showRateLimitWarning && <RateLimitWarning onClose={() => setShowRateLimitWarning(false)} />}
      <AuthContext.Provider
        value={{
          user,
          session,
          profile,
          loading,
          error,
          isAuthenticated: !!session,
          role,
          signIn,
          signOut,
          refreshSession,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  )
}

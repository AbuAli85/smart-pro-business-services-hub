"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

type AuthContextType = {
  user: any | null
  session: any | null
  profile: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: Error | null
  role: string | null
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  role: null,
  signIn: async () => ({}),
  signOut: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState<any | null>(null)
  const [session, setSession] = useState<any | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [role, setRole] = useState<string | null>(null)

  // Function to get user profile
  const getUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  // Function to sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) throw error

      if (data?.user) {
        // Get user profile
        const userProfile = await getUserProfile(data.user.id)
        setProfile(userProfile)
        setRole(userProfile?.role || null)
      }

      return data
    } catch (error: any) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  // Function to sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Effect to get the initial session and set up auth state listener
  useEffect(() => {
    let mounted = true
    let authListener: any = null

    async function getInitialSession() {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (mounted) {
          if (error) {
            setError(error)
          } else {
            setSession(data.session)
            setUser(data.session?.user || null)

            // Get user profile if we have a user
            if (data.session?.user) {
              const userProfile = await getUserProfile(data.session.user.id)
              setProfile(userProfile)
              setRole(userProfile?.role || null)
            }
          }
        }
      } catch (error: any) {
        if (mounted) {
          setError(error instanceof Error ? error : new Error("Unknown error"))
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    getInitialSession()

    // Set up auth state listener
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (mounted) {
          setSession(session)
          setUser(session?.user || null)

          // Get user profile if we have a user
          if (session?.user) {
            const userProfile = await getUserProfile(session.user.id)
            setProfile(userProfile)
            setRole(userProfile?.role || null)
          } else {
            setProfile(null)
            setRole(null)
          }

          setIsLoading(false)
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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: !!session,
        isLoading,
        error,
        role,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider

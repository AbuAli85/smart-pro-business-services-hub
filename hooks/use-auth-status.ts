"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"

export function useAuthStatus() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the session
        const { data: sessionData } = await supabase.auth.getSession()
        const session = sessionData?.session

        if (session) {
          setIsAuthenticated(true)
          setUser(session.user)

          // Get the user's role
          const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          setRole(profileData?.role || null)
        } else {
          setIsAuthenticated(false)
          setUser(null)
          setRole(null)
        }
      } catch (error) {
        console.error("Auth status check error:", error)
        setIsAuthenticated(false)
        setUser(null)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setIsAuthenticated(true)
        setUser(session.user)

        // Get the user's role
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        setRole(profileData?.role || null)
      } else {
        setIsAuthenticated(false)
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return { isAuthenticated, user, role, loading }
}

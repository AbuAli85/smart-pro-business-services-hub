/**
 * Auth Service Factory
 *
 * This module provides a factory function to get the appropriate auth service
 * based on the environment. In development, it returns a mock auth service
 * to prevent rate limiting issues. In production, it returns the real Supabase
 * auth service.
 */

import { getSupabaseClient } from "@/lib/supabase/client"
import { isDevelopment } from "@/lib/environment"

// Define the interface for auth services
export interface AuthService {
  signInWithPassword: (params: { email: string; password: string }) => Promise<any>
  signOut: () => Promise<any>
  getSession: () => Promise<any>
  onAuthStateChange: (callback: (event: string, session: any) => void) => any
}

// Mock auth service for development
const createMockAuthService = (): AuthService => {
  // Mock user data
  const mockUsers = [
    { id: "admin-id", email: "admin@example.com", role: "admin", name: "Admin User" },
    { id: "provider-id", email: "provider@example.com", role: "provider", name: "Provider User" },
    { id: "client-id", email: "client@example.com", role: "client", name: "Client User" },
  ]

  // Get stored session from localStorage
  const getStoredSession = () => {
    if (typeof window === "undefined") return null

    try {
      const storedSession = localStorage.getItem("mockAuthSession")
      return storedSession ? JSON.parse(storedSession) : null
    } catch (error) {
      console.error("Error reading mock session from localStorage:", error)
      return null
    }
  }

  // Store session in localStorage
  const storeSession = (session: any) => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("mockAuthSession", JSON.stringify(session))
    } catch (error) {
      console.error("Error storing mock session in localStorage:", error)
    }
  }

  // Clear stored session
  const clearStoredSession = () => {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem("mockAuthSession")
    } catch (error) {
      console.error("Error clearing mock session from localStorage:", error)
    }
  }

  return {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      // For mock service, accept any credentials
      // Find a matching user or use the first one
      const user = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || mockUsers[0]

      const session = {
        user,
        access_token: "mock-access-token",
        refresh_token: "mock-refresh-token",
        expires_at: Date.now() + 3600000, // 1 hour from now
      }

      storeSession(session)

      return {
        data: { session, user },
        error: null,
      }
    },

    signOut: async () => {
      clearStoredSession()
      return { error: null }
    },

    getSession: async () => {
      const session = getStoredSession()
      return {
        data: { session },
        error: null,
      }
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Return a mock subscription that does nothing
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }
    },
  }
}

// Real auth service using Supabase
const createRealAuthService = (): AuthService => {
  const supabase = getSupabaseClient()

  return {
    signInWithPassword: async (params) => {
      return await supabase.auth.signInWithPassword(params)
    },

    signOut: async () => {
      return await supabase.auth.signOut()
    },

    getSession: async () => {
      return await supabase.auth.getSession()
    },

    onAuthStateChange: (callback) => {
      return supabase.auth.onAuthStateChange(callback)
    },
  }
}

// Factory function to get the appropriate auth service
export const getAuthService = (): AuthService => {
  // Use mock service in development, real service in production
  return isDevelopment() ? createMockAuthService() : createRealAuthService()
}

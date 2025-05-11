// Create a Supabase client for client components
export const createClient = () => {
  // Use a simplified implementation that doesn't rely on auth-helpers-nextjs
  try {
    // Try to use the client from supabase/client if available
    const { supabase } = require("@/lib/supabase/client")
    return supabase
  } catch (error) {
    console.warn("Supabase client not available, using mock implementation")
    // Return a mock client for development
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: null, error: null }),
        signOut: async () => ({ error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
      }),
    }
  }
}

// Get the dashboard URL based on user role
export function getDashboardByRole(role: string | null): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard"
    case "provider":
      return "/provider/dashboard"
    case "client":
      return "/client/dashboard"
    default:
      return "/profile-setup"
  }
}

// Store intended destination in localStorage
export function saveIntendedDestination(destination: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("intended_destination", destination)
  }
}

// Get and clear the intended destination
export function getAndClearIntendedDestination(): string | null {
  if (typeof window === "undefined") return null

  const destination = localStorage.getItem("intended_destination")
  if (destination) {
    localStorage.removeItem("intended_destination")
  }
  return destination
}

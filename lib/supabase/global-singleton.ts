import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// This ensures we only create one instance of the Supabase client
let supabaseClient: any = null

// Define a global type for the window object to include our singleton
declare global {
  interface Window {
    __SUPABASE_SINGLETON_CLIENT__: any
  }
}

// Function to get the global singleton Supabase client
export function getGlobalSupabaseClient() {
  if (supabaseClient) return supabaseClient

  // Get environment variables with fallbacks
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // Create the client
  supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseClient
}

// Create a mock client for development
function createMockClient() {
  console.log("Creating mock Supabase client")
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback) => {
        setTimeout(() => {
          callback("INITIAL_SESSION", null)
        }, 0)
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signInWithPassword: async () => ({
        data: { user: { id: "mock-user-id", email: "mock@example.com" }, session: { access_token: "mock-token" } },
        error: null,
      }),
      signOut: async () => ({ error: null }),
    },
    from: (table) => ({
      select: (columns) => ({
        eq: (column, value) => ({
          single: async () => ({ data: null, error: null }),
          limit: (limit) => ({
            order: (column, { ascending }) => ({
              range: (from, to) => ({ data: [], error: null }),
            }),
          }),
        }),
        count: (options) => ({ data: 0, error: null, count: 0 }),
      }),
      insert: (data) => ({ data: null, error: null }),
      update: (data) => ({
        eq: (column, value) => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: (column, value) => ({ data: null, error: null }),
      }),
    }),
    storage: {
      from: (bucket) => ({
        upload: async () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "https://example.com/mock-image.jpg" } }),
      }),
    },
  }
}

// Export a singleton instance
export const supabase = getGlobalSupabaseClient()

// For compatibility with existing code
export const getSupabase = () => getGlobalSupabaseClient()
export const getSupabaseClient = () => getGlobalSupabaseClient()

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  return !!(supabaseUrl && supabaseAnonKey)
}

// Export the token cookie getter for compatibility
export const getTokenCookie = (cookies) => {
  return cookies.get("sb-auth-token")?.value
}

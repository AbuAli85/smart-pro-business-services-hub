import { createClient } from "@supabase/supabase-js"

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kpkvgkjlencbkchtssaf.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdnZna2psZW5jYmtjaHRzc2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM5MDI0NTYsImV4cCI6MTk5OTQ3ODQ1Nn0.LGg0RQCpG1FxQ5K8G5TJc4zcE3l3UVU3jY0sBHzNj0Q"

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "" && supabaseAnonKey !== "")
}

// Create a dummy client for SSR or when credentials are missing
const createDummyClient = () => {
  console.log("Using dummy Supabase client - this is for demo purposes only")

  // Create a mock implementation that doesn't make actual API calls
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: null, error: null }),
          limit: (limit: number) => ({
            order: (column: string, { ascending }: { ascending: boolean }) => ({ data: [], error: null }),
          }),
          order: (column: string, { ascending }: { ascending: boolean }) => ({ data: [], error: null }),
          not: (column: string, op: string, value: any) => ({ data: [], error: null }),
          in: (column: string, values: any[]) => ({ data: [], error: null }),
          contains: (column: string, value: any) => ({ data: [], error: null }),
          or: (query: string) => ({ data: [], error: null }),
          data: [],
          error: null,
        }),
        neq: (column: string, value: any) => ({
          data: [],
          error: null,
        }),
        limit: (limit: number) => ({
          order: (column: string, { ascending }: { ascending: boolean }) => ({ data: [], error: null }),
        }),
        order: (column: string, { ascending }: { ascending: boolean }) => ({ data: [], error: null }),
        single: async () => ({ data: null, error: null }),
        data: [],
        error: null,
      }),
      insert: (data: any) => ({
        select: () => ({ single: async () => ({ data: null, error: null }) }),
        single: async () => ({ data: null, error: null }),
        data: null,
        error: null,
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          select: () => ({ single: async () => ({ data: null, error: null }) }),
          single: async () => ({ data: null, error: null }),
          data: null,
          error: null,
        }),
        data: null,
        error: null,
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({ data: null, error: null }),
        data: null,
        error: null,
      }),
    }),
    channel: (name: string) => ({
      on: (event: string, config: any, callback: Function) => ({
        subscribe: (callback?: Function) => {
          if (callback) callback("SUBSCRIBED")
          return {
            unsubscribe: () => {},
          }
        },
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => ({ data: { path }, error: null }),
        getPublicUrl: (path: string) => ({ data: { publicUrl: `/mock-storage/${path}` } }),
      }),
    },
  }
}

// Create the actual client or a dummy one
let singleton: any

export const getSupabaseClient = () => {
  if (!singleton) {
    singleton =
      isBrowser && supabaseUrl && supabaseAnonKey
        ? createClient(supabaseUrl, supabaseAnonKey)
        : createDummyClient()
  }
  return singleton
}

export const supabase = getSupabaseClient()

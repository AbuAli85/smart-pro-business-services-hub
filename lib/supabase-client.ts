import { createClient } from "@supabase/supabase-js"

// Check if we're running on the client side
const isBrowser = typeof window !== "undefined"

// Create a singleton Supabase client
let supabaseInstance: any = null

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance

  // For development without Supabase, use mock data
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("Supabase credentials not found, using mock client")
    return createMockClient()
  }

  supabaseInstance = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  })

  return supabaseInstance
}

// Create a mock client for development without Supabase
const createMockClient = () => {
  // Mock data
  const mockData = {
    user: {
      id: "mock-user-id",
      email: "alex.johnson@example.com",
      user_metadata: {
        full_name: "Alex Johnson",
        avatar_url: null,
      },
    },
    stats: {
      totalAppointments: 15,
      activeProjects: 4,
      documents: 27,
      completionRate: 78,
    },
    bookings: [
      {
        id: 1,
        service: "Business Consultation",
        provider: "Jane Smith",
        date: "2023-06-15",
        time: "10:00 AM",
        status: "confirmed",
      },
      {
        id: 2,
        service: "Financial Planning",
        provider: "Robert Johnson",
        date: "2023-06-18",
        time: "2:00 PM",
        status: "pending",
      },
      {
        id: 3,
        service: "Marketing Strategy",
        provider: "Alice Williams",
        date: "2023-06-20",
        time: "11:30 AM",
        status: "confirmed",
      },
    ],
    documents: [
      {
        id: 1,
        name: "Business Proposal.pdf",
        uploaded_at: "2023-05-08",
        size: "2.4 MB",
      },
      {
        id: 2,
        name: "Financial Report Q2.xlsx",
        uploaded_at: "2023-05-08",
        size: "1.8 MB",
      },
      {
        id: 3,
        name: "Contract Draft.docx",
        uploaded_at: "2023-05-08",
        size: "3.2 MB",
      },
    ],
    activity: [
      { month: "Jan", value: 35 },
      { month: "Feb", value: 28 },
      { month: "Mar", value: 45 },
      { month: "Apr", value: 56 },
      { month: "May", value: 72 },
      { month: "Jun", value: 69 },
    ],
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: mockData.user }, error: null }),
      getSession: async () => ({ data: { session: { user: mockData.user } }, error: null }),
      signOut: async () => ({ error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: mockData.user, error: null }),
          order: () => ({
            limit: () => ({ data: mockData[table] || [], error: null }),
          }),
        }),
        order: () => ({
          limit: () => ({ data: mockData[table] || [], error: null }),
        }),
      }),
    }),
    rpc: (func: string) => {
      if (func === "get_dashboard_stats") {
        return { data: mockData.stats, error: null }
      }
      return { data: null, error: { message: "Function not found" } }
    },
  }
}

export const supabase = getSupabaseClient()

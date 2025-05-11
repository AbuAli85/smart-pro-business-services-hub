import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/database.types"
import { cookies } from "next/headers"

// Get dashboard URL based on user role
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

// Create a Supabase client for server components
export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: "", ...options })
        },
      },
    },
  )
}

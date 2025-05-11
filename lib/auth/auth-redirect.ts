import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import type { Database } from "@/lib/supabase/database.types"

// Create a Supabase client for server components
const createClient = () => {
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

// Get the current session and user
export async function getSession() {
  const supabase = createClient()
  const { data } = await supabase.auth.getSession()
  return data.session
}

// Get the user's role from their profile
export async function getUserRole() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) return null
  
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single()
    
  return data?.role || null
}

// Redirect based on authentication status and role
export async function redirectBasedOnAuth(
  isProtectedRoute = false, 
  allowedRoles: string[] = [], 
  redirectTo = "/auth/login"
) {
  const session = await getSession()
  
  // If no session and this is a protected route, redirect to login
  if (!session && isProtectedRoute) {
    const searchParams = new URLSearchParams()
    searchParams.set("redirectTo", redirectTo)
    redirect(`/auth/login?${searchParams.toString()}`)
  }
  
  // If we have a session but need to check roles
  if (session && allowedRoles.length > 0) {
    const role = await getUserRole()
    
    // If user doesn't have an allowed role, redirect to their dashboard
    if (!role || !allowedRoles.includes(role)) {
      redirect(getDashboardByRole(role))
    }
  }
  
  return { session, isAuthenticated: !!session }
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

// Save the intended destination for post-login redirect
export function saveIntendedDestination(destination: string) {
  const cookieStore = cookies()
  cookieStore.set("intended_destination", destination, {
    path: "/",
    maxAge: 60 * 10, // 10 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })
}

// Get and clear the intended destination
export function getAndClearIntendedDestination(): string | null {
  const cookieStore = cookies()
  const destination = cookieStore.get("intended_destination")?.value || null
  
  if (destination) {
    cookieStore.delete("intended_destination")
  }
  
  return destination
}

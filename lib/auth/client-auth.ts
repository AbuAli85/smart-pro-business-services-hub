import { supabase } from "@/lib/supabase/client"

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

// Check if the user is authenticated
export async function checkAuth() {
  const { data } = await supabase.auth.getSession()
  return {
    isAuthenticated: !!data.session,
    session: data.session,
  }
}

// Get the user's role
export async function getUserRole() {
  const { data: sessionData } = await supabase.auth.getSession()
  
  if (!sessionData.session) {
    return null
  }
  
  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", sessionData.session.user.id)
    .single()
    
  return data?.role || null
}

// Sign in the user and redirect to the appropriate dashboard
export async function signIn(email: string, password: string, redirectPath?: string | null) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw error
  }
  
  // Get the user's role
  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()
    
  const role = profileData?.role || "client"
  
  // Determine where to redirect
  const destination = redirectPath || getDashboardByRole(role)
  
  // Return the authentication result
  return {
    user: data.user,
    role,
    destination,
  }
}

// Sign out the user
export async function signOut() {
  await supabase.auth.signOut()
  window.location.href = "/auth/login"
}

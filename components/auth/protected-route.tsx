import { redirect } from "next/navigation"
import { getSession, getUserRole, getDashboardByRole } from "@/lib/auth/auth-redirect"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export async function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const session = await getSession()
  
  // If no session, redirect to login
  if (!session) {
    redirect("/auth/login")
  }
  
  // If we need to check roles
  if (allowedRoles.length > 0) {
    const role = await getUserRole()
    
    // If user doesn't have an allowed role, redirect to their dashboard
    if (!role || !allowedRoles.includes(role)) {
      redirect(getDashboardByRole(role))
    }
  }
  
  return <>{children}</>
}

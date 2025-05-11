// lib/rbac.ts
import { supabase } from './auth'

export enum UserRole {
  CLIENT = 'client',
  PROVIDER = 'provider',
  ADMIN = 'admin'
}

export async function getUserRole(): Promise<UserRole | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
    
  return data?.role as UserRole || null
}

export function checkPermission(
  userRole: UserRole | null,
  requiredRoles: UserRole[]
): boolean {
  if (!userRole) return false
  return requiredRoles.includes(userRole)
}
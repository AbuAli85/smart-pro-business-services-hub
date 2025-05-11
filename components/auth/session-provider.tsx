// components/auth/session-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/auth'

const SessionContext = createContext<{
  session: any | null;
  user: any | null;
  loading: boolean;
}>({
  session: null,
  user: null,
  loading: true
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null)
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setUser(data.session?.user || null)
      setLoading(false)
      
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          setSession(newSession)
          setUser(newSession?.user || null)
        }
      )
      
      return () => {
        authListener.subscription.unsubscribe()
      }
    }
    
    loadSession()
  }, [])
  
  return (
    <SessionContext.Provider value={{ session, user, loading }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
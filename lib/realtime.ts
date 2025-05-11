// lib/realtime.ts
import { supabase } from './auth'

export function subscribeToChannel(
  channel: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(channel)
    .on('postgres_changes', { event: '*', schema: 'public' }, callback)
    .subscribe()
}

export function subscribeToTable(
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) {
  return supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      { event, schema: 'public', table },
      callback
    )
    .subscribe()
}

export function subscribeToRecord(
  table: string,
  id: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*',
  callback: (payload: any) => void
) {
  return supabase
    .channel(`${table}-${id}`)
    .on(
      'postgres_changes',
      { event, schema: 'public', table, filter: `id=eq.${id}` },
      callback
    )
    .subscribe()
}
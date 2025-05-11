// lib/notification-service.ts
import { supabase } from './auth'

export enum NotificationType {
  BOOKING = 'booking',
  CONTRACT = 'contract',
  MESSAGE = 'message',
  SYSTEM = 'system'
}

export async function createNotification(
  userId: string,
  title: string,
  content: string,
  type: NotificationType
) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      content,
      type,
      read: false,
      created_at: new Date()
    })
    
  return !error
}

export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    
  return !error
}

export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
    
  return !error
}

export async function getUnreadCount(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .eq('read', false)
    
  if (error) return 0
  return data?.length || 0
}
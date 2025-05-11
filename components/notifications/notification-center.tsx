// components/notifications/notification-center.tsx
'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { supabase } from '@/lib/auth'
import { subscribeToTable } from '@/lib/realtime'

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    async function loadNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)
        
      if (data) {
        setNotifications(data)
        setUnreadCount(data.filter((n: any) => !n.read).length)
      }
    }
    
    loadNotifications()
    
    // Subscribe to new notifications
    const subscription = subscribeToTable(
      'notifications',
      'INSERT',
      (payload) => {
        const newNotification = payload.new
        setNotifications((prev) => [newNotification, ...prev])
        setUnreadCount((prev) => prev + 1)
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  async function markAsRead(id: string) {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id)
      
    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => prev - 1)
    }
  }
  
  async function markAllAsRead() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false)
      
    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      )
      setUnreadCount(0)
    }
  }
  
  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-10">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="text-sm text-blue-600"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-gray-600">
                      {notification.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
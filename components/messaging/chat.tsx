// components/messaging/chat.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/auth'
import { subscribeToTable } from '@/lib/realtime'

export function Chat({ recipientId }: { recipientId: string }) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    async function loadMessages() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
        .order('created_at', { ascending: true })
        
      if (data) {
        setMessages(data)
      }
      
      setLoading(false)
    }
    
    loadMessages()
    
    // Subscribe to new messages
    const subscription = subscribeToTable(
      'messages',
      'INSERT',
      (payload) => {
        const newMessage = payload.new
        setMessages((prev) => [...prev, newMessage])
      }
    )
    
    return () => {
      subscription.unsubscribe()
    }
  }, [recipientId])
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    
    if (!newMessage.trim()) return
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        recipient_id: recipientId,
        content: newMessage,
        created_at: new Date()
      })
      
    if (!error) {
      setNewMessage('')
    }
  }
  
  if (loading) {
    return <div>Loading messages...</div>
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === recipientId ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender_id === recipientId
                  ? 'bg-gray-100'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {message.content}
              <div
                className={`text-xs mt-1 ${
                  message.sender_id === recipientId
                    ? 'text-gray-500'
                    : 'text-blue-200'
                }`}
              >
                {new Date(message.created_at).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="border-t p-4">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-md"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}
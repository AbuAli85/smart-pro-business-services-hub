// components/dashboard/real-time-stats.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/auth'
import { subscribeToTable } from '@/lib/realtime'

export function RealTimeStats() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    totalContracts: 0
  })
  
  useEffect(() => {
    async function loadStats() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      // Get booking stats
      const { data: bookings } = await supabase
        .from('bookings')
        .select('status')
        .eq('user_id', user.id)
        
      if (bookings) {
        setStats((prev) => ({
          ...prev,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b) => b.status === 'pending').length,
          completedBookings: bookings.filter((b) => b.status === 'completed').length
        }))
      }
      
      // Get contract stats
      const { data: contracts } = await supabase
        .from('contracts')
        .select('id')
        .eq('user_id', user.id)
        
      if (contracts) {
        setStats((prev) => ({
          ...prev,
          totalContracts: contracts.length
        }))
      }
    }
    
    loadStats()
    
    // Subscribe to booking changes
    const bookingsSubscription = subscribeToTable(
      'bookings',
      '*',
      () => {
        // Reload stats when bookings change
        loadStats()
      }
    )
    
    // Subscribe to contract changes
    const contractsSubscription = subscribeToTable(
      'contracts',
      '*',
      () => {
        // Reload stats when contracts change
        loadStats()
      }
    )
    
    return () => {
      bookingsSubscription.unsubscribe()
      contractsSubscription.unsubscribe()
    }
  }, [])
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Total Bookings</div>
        <div className="text-3xl font-bold">{stats.totalBookings}</div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Pending Bookings</div>
        <div className="text-3xl font-bold">{stats.pendingBookings}</div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Completed Bookings</div>
        <div className="text-3xl font-bold">{stats.completedBookings}</div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Total Contracts</div>
        <div className="text-3xl font-bold">{stats.totalContracts}</div>
      </div>
    </div>
  )
}
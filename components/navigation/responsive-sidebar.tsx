// components/navigation/responsive-sidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Home, Calendar, FileText, MessageSquare, Settings, User, LogOut } from 'lucide-react'
import { useSession } from '@/components/auth/session-provider'
import { supabase } from '@/lib/supabase-client'

export function ResponsiveSidebar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user } = useSession()
  
  // Close menu when screen size changes
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Contracts', href: '/dashboard/contracts', icon: FileText },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]
  
  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden">
        <button
          type="button"
          className="p-2 rounded-md text-gray-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open menu</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-25">
          <div className="fixed inset-y-0 left-0 w-64 bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="font-bold text-xl">SmartPRO</div>
              <button
                type="button"
                title="Close menu"
                className="p-2 rounded-md text-gray-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            <nav className="mt-5 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 py-2 rounded-md ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex items-center h-16 px-4 border-b">
            <div className="font-bold text-xl">SmartPRO</div>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-2 py-2 rounded-md ${
                  pathname === item.href
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200">
              {/* User avatar */}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.user_metadata?.full_name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          
          <button
            className="mt-4 w-full flex items-center px-2 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </div>
    </>
  )
}
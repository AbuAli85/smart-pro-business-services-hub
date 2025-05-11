"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  Clock,
  User,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function Sidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = "/auth/login"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/client/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/client/dashboard",
    },
    {
      name: "Bookings",
      href: "/client/bookings",
      icon: Calendar,
      current: pathname?.includes("/client/bookings"),
    },
    {
      name: "Contracts",
      href: "/client/contracts",
      icon: FileText,
      current: pathname?.includes("/client/contracts"),
    },
    {
      name: "Messages",
      href: "/client/messages",
      icon: MessageSquare,
      current: pathname?.includes("/client/messages"),
    },
    {
      name: "Availability",
      href: "/client/availability",
      icon: Clock,
      current: pathname?.includes("/client/availability"),
    },
    {
      name: "Profile",
      href: "/client/profile",
      icon: User,
      current: pathname?.includes("/client/profile"),
    },
    {
      name: "Settings",
      href: "/client/settings",
      icon: Settings,
      current: pathname?.includes("/client/settings"),
    },
  ]

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <button
          type="button"
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
        </button>
      )}

      {/* Mobile sidebar */}
      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <Link href="/client/dashboard" className="text-2xl font-bold text-blue-600">
                  SmartPRO
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    item.current ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${item.current ? "text-white" : "text-gray-400"}`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 w-full"
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/client/dashboard" className="text-2xl font-bold text-blue-600">
                  SmartPRO
                </Link>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      item.current ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${item.current ? "text-white" : "text-gray-400"}`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 w-full"
              >
                <LogOut className="mr-3 h-5 w-5 text-red-500" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

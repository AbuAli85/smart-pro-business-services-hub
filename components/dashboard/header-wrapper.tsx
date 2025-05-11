"use client"

import { useState } from "react"
import { HeaderWithNotifications } from "./header-with-notifications"
import { MobileSidebar } from "./mobile-sidebar"

export function HeaderWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen)
  }
  
  const handleSidebarOpenChange = (open: boolean) => {
    setSidebarOpen(open)
  }
  
  return (
    <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <MobileSidebar sidebarOpen={sidebarOpen} onOpenChange={handleSidebarOpenChange} />
      <HeaderWithNotifications />
    </div>
  )
}

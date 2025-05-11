"use client"

import { useState, useEffect } from "react"
import { ProviderSidebar } from "./provider-sidebar"

interface SidebarWrapperProps {
  sidebarOpen?: boolean
}

export function SidebarWrapper({ sidebarOpen }: SidebarWrapperProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    if (sidebarOpen !== undefined) {
      setIsOpen(sidebarOpen)
    }
  }, [sidebarOpen])
  
  return (
    <div className={`hidden md:flex md:w-64 md:flex-col ${isOpen ? 'md:block' : ''}`}>
      <ProviderSidebar />
    </div>
  )
}

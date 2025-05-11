"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { ProviderSidebar } from "./provider-sidebar"

interface MobileSidebarProps {
  sidebarOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function MobileSidebar({ sidebarOpen, onOpenChange }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)
  
  useEffect(() => {
    if (sidebarOpen !== undefined) {
      setOpen(sidebarOpen)
    }
  }, [sidebarOpen])
  
  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (onOpenChange) {
      onOpenChange(open)
    }
  }
  
  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <ProviderSidebar />
      </SheetContent>
    </Sheet>
  )
}

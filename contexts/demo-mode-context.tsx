"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface DemoModeContextType {
  isDemoMode: boolean
  toggleDemoMode: () => void
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined)

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(true) // Default to demo mode

  const toggleDemoMode = () => {
    setIsDemoMode((prev) => !prev)
  }

  return <DemoModeContext.Provider value={{ isDemoMode, toggleDemoMode }}>{children}</DemoModeContext.Provider>
}

export function useDemoMode() {
  const context = useContext(DemoModeContext)
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider")
  }
  return context
}

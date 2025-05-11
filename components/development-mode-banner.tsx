"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

export function DevelopmentModeBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Only show banner after component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || dismissed) {
    return null
  }

  return (
    <div className="bg-amber-500 text-black px-4 py-2 text-sm flex items-center justify-between sticky top-0 z-50 w-full">
      <div className="flex items-center">
        <span className="font-semibold mr-2">Development Mode</span>
        <span>Using mock services to prevent API rate limits</span>
      </div>
      <button onClick={() => setDismissed(true)} className="p-1 hover:bg-amber-600 rounded-full" aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  )
}

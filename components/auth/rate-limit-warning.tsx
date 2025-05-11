"use client"

import { useState } from "react"
import { AlertTriangle, X } from "lucide-react"

interface RateLimitWarningProps {
  onClose?: () => void
}

export function RateLimitWarning({ onClose }: RateLimitWarningProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    if (onClose) onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-amber-100 border-b border-amber-200 shadow-md">
      <div className="container mx-auto flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-amber-800">Authentication Rate Limit Reached</h3>
            <p className="text-sm text-amber-700 mt-1">
              Too many authentication requests have been made in a short period. This is now using a mock authentication
              service. Your actions will still work, but no real API calls will be made.
            </p>
            <div className="mt-2">
              <a
                href="https://supabase.com/docs/guides/auth/rate-limits"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-800 underline hover:text-amber-900"
              >
                Learn more about rate limits
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="text-amber-600 hover:text-amber-800 focus:outline-none"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

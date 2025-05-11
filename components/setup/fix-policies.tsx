"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function FixPolicies() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleFixPolicies = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/setup/database/fix-policies", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message || "Database policies fixed successfully!",
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to fix database policies.",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while fixing database policies.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Fix Database Policies</h2>
        <p className="text-gray-600">
          This utility will check for existing policies before creating them to avoid conflicts.
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-md border ${result.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">{result.success ? "Success" : "Error"}</h3>
              <div className="mt-1 text-sm text-gray-700">{result.message}</div>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleFixPolicies}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Fixing Policies..." : "Fix Database Policies"}
      </Button>
    </div>
  )
}

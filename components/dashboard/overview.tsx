"use client"

import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function Overview() {
  const [loading, setLoading] = useState(false)

  // Simulate loading for better UX
  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Revenue Overview</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
            <span className="sr-only">Information</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>
      </div>

      <Alert variant="warning" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demo Mode</AlertTitle>
        <AlertDescription>Showing sample data. Database access is limited or unavailable.</AlertDescription>
      </Alert>

      <div className="h-[350px] w-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Chart visualization is disabled in this version.</p>
      </div>
    </>
  )
}

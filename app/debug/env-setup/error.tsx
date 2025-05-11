"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Environment setup error:", error)
  }, [error])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Environment Setup</h1>
      <Card className="w-full max-w-3xl mx-auto border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error Loading Environment Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700 mb-4">
            There was a problem loading the environment setup tool. This might be due to missing dependencies or
            configuration issues.
          </p>
          <div className="bg-white p-3 rounded border border-red-200 text-xs font-mono overflow-auto max-h-32">
            {error.message}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={reset} variant="outline" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

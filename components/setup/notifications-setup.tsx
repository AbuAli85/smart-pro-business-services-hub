"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, Info } from "lucide-react"

export function NotificationsSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<string | null>(null)

  const setupNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/setup/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      // Always parse the response, even if it's an error
      let data
      try {
        data = await response.json()
      } catch (e) {
        throw new Error("Invalid response from server")
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to set up notifications")
      }

      setSuccess(true)
      setDetails(data.details || null)
    } catch (err) {
      console.error("Error setting up notifications:", err)
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Up Notifications</CardTitle>
        <CardDescription>
          Configure the database tables and triggers needed for the notification system.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {success ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-600">Success</AlertTitle>
            <AlertDescription>
              Notifications have been set up successfully. You can now receive real-time notifications.
            </AlertDescription>
          </Alert>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <p className="text-muted-foreground">
            This will create the necessary database tables and triggers for the notification system. This includes:
          </p>
        )}

        {details && (
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-600">Details</AlertTitle>
            <AlertDescription className="text-blue-700">{details}</AlertDescription>
          </Alert>
        )}

        {!success && (
          <ul className="list-disc list-inside mt-4 space-y-2 text-muted-foreground">
            <li>Creating the notifications table</li>
            <li>Setting up row-level security policies</li>
            <li>Creating triggers for automatic notifications</li>
            <li>Configuring real-time subscriptions</li>
          </ul>
        )}
      </CardContent>

      <CardFooter>
        {!success && (
          <Button onClick={setupNotifications} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              "Set Up Notifications"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

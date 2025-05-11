"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2, AlertCircle, Info, ArrowRight, Bell, Mail, Settings, FileText } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/simplified-label"
import Link from "next/link"

// Import the switch component (which now uses our simplified version)
import { Switch } from "@/components/ui/switch"

export default function NotificationsSetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<string | null>(null)
  const [notificationsSupported, setNotificationsSupported] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState("setup")

  // Notification configuration options
  const [config, setConfig] = useState({
    inApp: true,
    email: false,
    bookings: true,
    messages: true,
    contracts: true,
    system: true,
  })

  // Check if browser supports notifications
  const checkNotificationSupport = () => {
    const supported = "Notification" in window
    setNotificationsSupported(supported)
    return supported
  }

  // Request notification permissions
  const requestNotificationPermission = async () => {
    if (!checkNotificationSupport()) return false

    try {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }

  const setupNotifications = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check browser support for notifications
      checkNotificationSupport()

      // Request permission if supported
      if (notificationsSupported) {
        await requestNotificationPermission()
      }

      const response = await fetch("/api/setup/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ config }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to set up notifications")
      }

      setIsComplete(true)
      setDetails(data.details || null)
      setActiveTab("next-steps")

      toast({
        title: "Success",
        description: data.message || "Notifications system has been set up successfully",
      })
    } catch (error: any) {
      console.error("Error setting up notifications:", error)
      setError(error.message || "An unexpected error occurred")

      toast({
        title: "Error",
        description: error.message || "Failed to set up notifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const verifySetup = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/setup/notifications/verify", {
        method: "GET",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Verification failed")
      }

      toast({
        title: "Verification Complete",
        description: data.message || "Notification tables exist and are properly configured",
      })
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || "Could not verify notification setup",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestNotification = async () => {
    try {
      const response = await fetch("/api/notifications/test", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send test notification")
      }

      toast({
        title: "Test Notification Sent",
        description: "Check your notifications to see the test message",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send test notification",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Set Up Notifications</CardTitle>
          <CardDescription>Configure the notification system for your business services hub</CardDescription>
        </CardHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mx-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="configure" disabled={!isComplete}>
              Configure
            </TabsTrigger>
            <TabsTrigger value="next-steps" disabled={!isComplete}>
              Next Steps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="p-4">
            <CardContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                This will create the necessary database tables and triggers for the notifications system, including
                message notifications, booking notifications, and more.
              </p>

              {notificationsSupported === false && (
                <Alert variant="warning" className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-600">Browser Notifications Not Supported</AlertTitle>
                  <AlertDescription>
                    Your browser doesn't support notifications. You'll still receive in-app notifications, but won't get
                    desktop alerts.
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isComplete && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-600">Success</AlertTitle>
                  <AlertDescription>Notifications system has been set up successfully</AlertDescription>
                </Alert>
              )}

              {details && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-600">Details</AlertTitle>
                  <AlertDescription className="text-blue-700">{details}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="bookings"
                      checked={config.bookings}
                      onChange={(checked) => setConfig({ ...config, bookings: checked })}
                    />
                    <Label htmlFor="bookings">Booking Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="messages"
                      checked={config.messages}
                      onChange={(checked) => setConfig({ ...config, messages: checked })}
                    />
                    <Label htmlFor="messages">Message Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="contracts"
                      checked={config.contracts}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setConfig({ ...config, contracts: e.target.checked })
                      }
                    />
                    <Label htmlFor="contracts">Contract Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="system"
                      checked={config.system}
                      onChange={(checked) => setConfig({ ...config, system: checked })}
                    />
                    <Label htmlFor="system">System Notifications</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Delivery Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="inApp"
                      checked={config.inApp}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setConfig({ ...config, inApp: e.target.checked })
                      }
                    />
                    <Label htmlFor="inApp">In-App Notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email"
                      checked={config.email}
                      onChange={(checked) => setConfig({ ...config, email: checked })}
                    />
                    <Label htmlFor="email">Email Notifications</Label>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button onClick={setupNotifications} disabled={isLoading || isComplete} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : isComplete ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Setup Complete
                  </>
                ) : (
                  "Set Up Notifications"
                )}
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="configure" className="p-4">
            <CardContent className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure your notification preferences. These settings can be changed at any time.
              </p>

              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-md font-medium">Notification Types</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="booking-notify">Booking Notifications</Label>
                      </div>
                      <Switch
                        id="booking-notify"
                        checked={config.bookings}
                        onChange={(checked) => setConfig({ ...config, bookings: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="message-notify">Message Notifications</Label>
                      </div>
                      <Switch
                        id="message-notify"
                        checked={config.messages}
                        onChange={(checked) => setConfig({ ...config, messages: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="contract-notify">Contract Notifications</Label>
                      </div>
                      <Switch
                        id="contract-notify"
                        checked={config.contracts}
                        onChange={(checked) => setConfig({ ...config, contracts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="system-notify">System Notifications</Label>
                      </div>
                      <Switch
                        id="system-notify"
                        checked={config.system}
                        onChange={(checked) => setConfig({ ...config, system: checked })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-medium">Delivery Methods</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="inapp-delivery">In-App Notifications</Label>
                      </div>
                      <Switch
                        id="inapp-delivery"
                        checked={config.inApp}
                        onChange={(checked) => setConfig({ ...config, inApp: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="email-delivery">Email Notifications</Label>
                      </div>
                      <Switch
                        id="email-delivery"
                        checked={config.email}
                        onChange={(checked) => setConfig({ ...config, email: checked })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <Button onClick={verifySetup} variant="outline" disabled={isLoading}>
                Verify Setup
              </Button>
              <Button onClick={sendTestNotification} disabled={isLoading}>
                Send Test Notification
              </Button>
            </CardFooter>
          </TabsContent>

          <TabsContent value="next-steps" className="p-4">
            <CardContent className="space-y-4 pt-4">
              <h3 className="text-lg font-medium">Next Steps</h3>
              <p className="text-sm text-muted-foreground">
                Now that you've set up notifications, here are some things you can do:
              </p>

              <div className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900">Test the notification system</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Create a new booking or send a message to test that notifications are working correctly.
                      </p>
                      <div className="mt-3">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/dashboard/bookings/new">Create a Booking</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <Settings className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900">Customize notification preferences</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Configure which notifications you want to receive and how you want to receive them.
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" onClick={() => setActiveTab("configure")}>
                          Configure Notifications
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900">Read the documentation</h4>
                      <p className="mt-1 text-sm text-gray-600">
                        Learn more about how the notification system works and how to get the most out of it.
                      </p>
                      <div className="mt-3">
                        <Button asChild variant="outline" size="sm">
                          <Link href="/docs/notifications">View Documentation</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <Button onClick={sendTestNotification} className="w-full">
                Send Test Notification
              </Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

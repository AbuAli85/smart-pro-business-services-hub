"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase/client"
import { Loader2, Calendar, List, ArrowLeft, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

type Booking = {
  id: string
  provider_id: string
  service_name: string
  booking_date: string
  start_time: string
  end_time: string
  status: string
  location: string
  provider_name?: string
}

export default function ClientBookingsPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")

  useEffect(() => {
    if (!isAuthenticated) {
      console.log("No active session, using demo data")
      // Show demo data or redirect to login
      setIsLoading(false)
      return
    }

    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select(`
            id, 
            provider_id, 
            service_name, 
            booking_date, 
            start_time, 
            end_time, 
            status, 
            location
          `)
          .eq("client_id", user?.id)
          .order("booking_date", { ascending: true })
          .order("start_time", { ascending: true })

        if (error) throw error

        // Fetch provider names
        if (data && data.length > 0) {
          const providerIds = [...new Set(data.map((booking) => booking.provider_id))]

          const { data: providersData, error: providersError } = await supabase
            .from("profiles")
            .select("id, full_name")
            .in("id", providerIds)

          if (providersError) throw providersError

          // Add provider names to bookings
          const bookingsWithProviders = data.map((booking) => {
            const provider = providersData?.find((p) => p.id === booking.provider_id)
            return {
              ...booking,
              provider_name: provider?.full_name || "Unknown Provider",
            }
          })

          setBookings(bookingsWithProviders)
        } else {
          setBookings([])
        }
      } catch (error) {
        console.error("Error fetching bookings:", error)
        toast({
          title: "Error",
          description: "Failed to load your bookings",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [isAuthenticated, user, toast])

  const cancelBooking = async (bookingId: string) => {
    try {
      const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", bookingId)

      if (error) throw error

      // Update local state
      setBookings(bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" } : booking)))

      toast({
        title: "Booking cancelled",
        description: "Your booking has been successfully cancelled",
      })
    } catch (error) {
      console.error("Error cancelling booking:", error)
      toast({
        title: "Error",
        description: "Failed to cancel your booking",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatBookingTime = (date: string, startTime: string, endTime: string) => {
    const start = new Date(`${date}T${startTime}`)
    const end = new Date(`${date}T${endTime}`)
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
  }

  const now = new Date()
  const upcomingBookings = bookings.filter((booking) => {
    const bookingDate = new Date(`${booking.booking_date}T${booking.end_time}`)
    return bookingDate >= now && booking.status.toLowerCase() !== "cancelled"
  })

  const pastBookings = bookings.filter((booking) => {
    const bookingDate = new Date(`${booking.booking_date}T${booking.end_time}`)
    return bookingDate < now || booking.status.toLowerCase() === "cancelled"
  })

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Button onClick={() => router.push("/client/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upcoming" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center">
            <List className="mr-2 h-4 w-4" />
            Past & Cancelled
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.service_name}</CardTitle>
                    <CardDescription>with {booking.provider_name}</CardDescription>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(booking.booking_date), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{formatBookingTime(booking.booking_date, booking.start_time, booking.end_time)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {booking.status.toLowerCase() !== "cancelled" && (
                      <Button
                        variant="outline"
                        className="w-full text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No upcoming bookings</h3>
                <p className="text-muted-foreground mt-2">You don't have any upcoming appointments scheduled.</p>
                <Button className="mt-6" onClick={() => router.push("/client/bookings/new")}>
                  Book an Appointment
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastBookings.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardHeader>
                    <CardTitle>{booking.service_name}</CardTitle>
                    <CardDescription>with {booking.provider_name}</CardDescription>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(booking.booking_date), "MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{formatBookingTime(booking.booking_date, booking.start_time, booking.end_time)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{booking.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <List className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No past bookings</h3>
                <p className="text-muted-foreground mt-2">You don't have any past or cancelled appointments.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="mt-8 text-center">
        <Button size="lg" onClick={() => router.push("/client/bookings/new")}>
          Book a New Appointment
        </Button>
      </div>
    </div>
  )
}

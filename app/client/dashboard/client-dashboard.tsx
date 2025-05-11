"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { useAuth } from "@/components/auth/auth-provider"
import { useData } from "@/hooks/use-data"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getInitials } from "@/lib/utils"
import { 
  Calendar, 
  Clock, 
  FileText, 
  LayoutDashboard, 
  Download, 
  Upload, 
  ExternalLink,
  Check 
} from "lucide-react"

// Types for our data
interface Booking {
  id: number
  service: string
  provider: string
  date: Date
  status: string
  notes?: string
}

interface Document {
  id: number
  name: string
  uploaded_at: Date
  size: string
  type: string
  url: string
}

interface DashboardStats {
  totalAppointments: number
  activeProjects: number
  documents: number
  completionRate: number
}

interface ActivityData {
  month: string
  value: number
}

// Mock data to use when API fails
const MOCK_BOOKINGS: Booking[] = [
  {
    id: 1,
    service: "Tax Consultation",
    provider: "John Smith",
    date: new Date("2023-12-15T14:00:00"),
    status: "confirmed"
  },
  {
    id: 2,
    service: "Business Planning",
    provider: "Sarah Johnson",
    date: new Date("2023-12-20T10:30:00"),
    status: "pending",
    notes: "Bring financial statements from last quarter"
  }
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 1,
    name: "Business Plan.pdf",
    uploaded_at: new Date("2023-11-20"),
    size: "2.4 MB",
    type: "pdf",
    url: "/documents/business-plan.pdf"
  },
  {
    id: 2,
    name: "Tax Filing 2023.xlsx",
    uploaded_at: new Date("2023-11-15"),
    size: "1.8 MB",
    type: "excel",
    url: "/documents/tax-filing.xlsx"
  }
];

const MOCK_STATS: DashboardStats = {
  totalAppointments: 8,
  activeProjects: 3,
  documents: 12,
  completionRate: 75
};

const MOCK_ACTIVITY: ActivityData[] = [
  { month: "Jul", value: 30 },
  { month: "Aug", value: 45 },
  { month: "Sep", value: 60 },
  { month: "Oct", value: 40 },
  { month: "Nov", value: 55 },
  { month: "Dec", value: 70 }
];

export default function ClientDashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // This hook is correctly called at the top level

  // Safely fetch data using SWR with fallbacks to mock data if APIs return 404
  const { data: bookings = MOCK_BOOKINGS, error: bookingsError } = useData<Booking[]>(
    user?.id ? `bookings:byUser:${user?.id}:5` : null
  );
  
  const { data: documents = MOCK_DOCUMENTS, error: documentsError } = useData<Document[]>(
    user?.id ? `documents:byUser:${user?.id}:3` : null
  );
  
  const { data: stats = MOCK_STATS, error: statsError } = useData<DashboardStats>("dashboard:stats");
  const { data: activity = MOCK_ACTIVITY, error: activityError } = useData<ActivityData[]>("activity:all:6");

  // Track if there are actual data errors (not just 404s we're handling with mock data)
  const hasError = 
    (bookingsError && bookingsError.status !== 404) || 
    (documentsError && documentsError.status !== 404) || 
    (statsError && statsError.status !== 404) || 
    (activityError && activityError.status !== 404);

  useEffect(() => {
    // Data is loaded (or we're using mock data), so we can stop showing loading state
    setLoading(false);
  }, [bookings, documents, stats, activity]);

  // Render skeleton loaders instead of a full-page spinner
  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
          <div>
            <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2"></div>
            <div className="h-4 w-80 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-9 w-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-6 w-12 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="grid gap-6 md:grid-cols-6">
          <div className="col-span-6 md:col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <div className="h-5 w-40 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded animate-pulse"></div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="col-span-6 md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="h-5 w-20 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="h-24 w-24 rounded-full bg-muted animate-pulse mb-4"></div>
                <div className="h-5 w-32 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {bookingsError && bookingsError.status !== 404 && <p>Error loading bookings: {bookingsError.message}</p>}
              {documentsError && documentsError.status !== 404 && <p>Error loading documents: {documentsError.message}</p>}
              {statsError && statsError.status !== 404 && <p>Error loading statistics: {statsError.message}</p>}
              {activityError && activityError.status !== 404 && <p>Error loading activity data: {activityError.message}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Extract user information with proper fallbacks
  const userName = user?.user_metadata?.name || 
                   user?.user_metadata?.full_name || 
                   (user?.email ? user.email.split("@")[0] : "User");
  const userInitials = getInitials(userName);
  const userAvatar = user?.user_metadata?.avatar_url || null;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with welcome message and profile summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userName.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Button variant="default" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.documents}</div>
            <p className="text-xs text-muted-foreground">+8 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main content area */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Left column - 4/6 width */}
        <div className="col-span-6 md:col-span-4 space-y-6">
          <Tabs defaultValue="upcoming" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
                <TabsTrigger value="past">Past Bookings</TabsTrigger>
              </TabsList>
              <Button variant="ghost" size="sm" asChild>
                <a href="/client/bookings">View All</a>
              </Button>
            </div>
            <TabsContent value="upcoming" className="space-y-4">
              {bookings && bookings.length > 0 ? (
                bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle>{booking.service}</CardTitle>
                        <Badge variant={booking.status === "confirmed" ? "default" : "outline"}>
                          {booking.status}
                        </Badge>
                      </div>
                      <CardDescription>With {booking.provider}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(booking.date), "EEEE, MMMM d, yyyy")}</span>
                        <span className="mx-2">•</span>
                        <span>{format(new Date(booking.date), "h:mm a")}</span>
                      </div>
                      {booking.notes && (
                        <p className="mt-2 text-sm text-muted-foreground">{booking.notes}</p>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No upcoming bookings</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href="/client/bookings/new">Schedule Appointment</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="past">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground">Past bookings will appear here</p>
                  <Button variant="outline" className="mt-4" asChild>
                    <a href="/client/bookings">View Booking History</a>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>Your activity over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] w-full">
                <div className="flex h-full items-end gap-2">
                  {activity &&
                    activity.map((month) => (
                      <div key={month.month} className="relative flex h-full w-full flex-col items-center">
                        <div
                          className="w-full bg-primary rounded-md transition-all duration-300 ease-in-out hover:opacity-80"
                          style={{ height: `${month.value}%` }}
                        ></div>
                        <span className="mt-2 text-xs text-muted-foreground">{month.month}</span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - 2/6 width */}
        <div className="col-span-6 md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                {userAvatar ? (
                  <AvatarImage src={userAvatar} alt={userName} />
                ) : (
                  <AvatarFallback>{userInitials}</AvatarFallback>
                )}
              </Avatar>
              <h3 className="text-lg font-medium">{userName}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="mt-6 space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span>Account Type:</span>
                  <span className="font-medium">Business</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Member Since:</span>
                  <span className="font-medium">June 2023</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <Badge variant="outline" className="ml-auto">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/client/profile">Edit Profile</a>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Recent Documents</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/client/documents">View All</a>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents && documents.length > 0 ? (
                  documents.map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3">
                      <div className="rounded-md bg-muted p-2">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(doc.uploaded_at), "MMM d, yyyy")} • {doc.size}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={doc.url} download title={`Download ${doc.name}`}>
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No documents yet</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="/client/documents/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Document
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
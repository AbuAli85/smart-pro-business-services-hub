"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { format } from "date-fns"
import { Calendar, Clock, FileText, LayoutDashboard, Download, Upload, ExternalLink } from 'lucide-react'
import { ClientProtectedRoute } from "@/components/auth/client-protected-route"

type Stats = {
  totalAppointments: number;
  activeProjects: number;
  documents: number;
  completionRate: number;
};

type ActivityItem = {
  month: string
  value: number
}

type Booking = {
  id: string
  service: string
  provider: string
  date: Date | string
  time: string
  status: string
}

type DocumentItem = {
  id: string
  name: string
  uploaded_at: Date | string
  size: string
}

type User = {
  name: string
  email: string
  initials: string
  accountType: string
  memberSince: string
  status: string
}

type DashboardData = {
  stats: Stats
  activity: ActivityItem[]
  bookings: Booking[]
  documents: DocumentItem[]
  user: User
}

function ClientDashboard() {
  const [data, setData] = useState({
    stats: {
      totalAppointments: 15,
      activeProjects: 4,
      documents: 27,
      completionRate: 78,
    },
    activity: [
      { month: "Jan", value: 35 },
      { month: "Feb", value: 28 },
      { month: "Mar", value: 45 },
      { month: "Apr", value: 56 },
      { month: "May", value: 72 },
      { month: "Jun", value: 69 },
    ],
    bookings: [
      {
        id: "1",
        service: "Business Consultation",
        provider: "Jane Smith",
        date: new Date(2023, 5, 15),
        time: "10:00 AM",
        status: "confirmed",
      },
      {
        id: "2",
        service: "Financial Planning",
        provider: "Robert Johnson",
        date: new Date(2023, 5, 18),
        time: "2:00 PM",
        status: "pending",
      },
      {
        id: "3",
        service: "Marketing Strategy",
        provider: "Alice Williams",
        date: new Date(2023, 5, 20),
        time: "11:30 AM",
        status: "confirmed",
      },
    ],
    documents: [
      {
        id: "1",
        name: "Business Proposal.pdf",
        uploaded_at: new Date(2023, 4, 8),
        size: "2.4 MB",
      },
      {
        id: "2",
        name: "Financial Report Q2.xlsx",
        uploaded_at: new Date(2023, 4, 8),
        size: "1.8 MB",
      },
      {
        id: "3",
        name: "Contract Draft.docx",
        uploaded_at: new Date(2023, 4, 8),
        size: "3.2 MB",
      },
    ],
    user: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      initials: "AJ",
      accountType: "Business",
      memberSince: "June 2023",
      status: "Active",
    },
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    async function fetchData() {
      try {
        // Try to get user data
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (!userError && userData?.user) {
          setData((prev) => ({
            ...prev,
            user: {
              name: userData.user.user_metadata?.full_name || "Alex Johnson",
              email: userData.user.email || "alex.johnson@example.com",
              initials: getInitials(userData.user.user_metadata?.full_name || "Alex Johnson"),
              accountType: "Business",
              memberSince: "June 2023",
              status: "Active",
            },
          }))
        }

        // Try to get dashboard stats
        try {
          const { data: statsData, error: statsError } = await supabase.rpc("get_dashboard_stats")

          if (!statsError && statsData) {
            setData((prev) => ({ ...prev, stats: statsData }))
          }
        } catch (error) {
          console.log("Using mock stats data")
        }

        // Try to get bookings
        try {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from("bookings")
            .select("*")
            .order("date", { ascending: true })
            .limit(3)

          if (!bookingsError && bookingsData && bookingsData.length > 0) {
            setData((prev) => ({ ...prev, bookings: bookingsData }))
          }
        } catch (error) {
          console.log("Using mock bookings data")
        }

        // Try to get documents
        try {
          const { data: documentsData, error: documentsError } = await supabase
            .from("documents")
            .select("*")
            .order("uploaded_at", { ascending: false })
            .limit(3)

          if (!documentsError && documentsData && documentsData.length > 0) {
            setData((prev) => ({ ...prev, documents: documentsData }))
          }
        } catch (error) {
          console.log("Using mock documents data")
        }

        // Try to get activity data
        try {
          const { data: activityData, error: activityError } = await supabase
            .from("activity")
            .select("*")
            .order("id", { ascending: false })
            .limit(6)

          if (!activityError && activityData && activityData.length > 0) {
            setData((prev) => ({ ...prev, activity: activityData }))
          }
        } catch (error) {
          console.log("Using mock activity data")
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set progress after a delay for animation
    const timer = setTimeout(() => {
      setProgress(data.stats.completionRate)
    }, 500)

    return () => clearTimeout(timer)
  }, [data.stats.completionRate])

  // Helper function to get initials from name
  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Helper function to format date
  function formatDate(date: Date | string): string {
    if (!(date instanceof Date)) {
      date = new Date(date)
    }
    return format(date, "EEEE, MMMM d, yyyy")
  }

  // Helper function to format short date
  function formatShortDate(date: Date | string): string {
    if (!(date instanceof Date)) {
      date = new Date(date)
    }
    return format(date, "MMM d, yyyy")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header with welcome message */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {data.user.name.split(" ")[0]}</h1>
          <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your business today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 border rounded-md flex items-center gap-2 text-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export Data
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2 text-sm hover:bg-blue-700">
            <ExternalLink className="h-4 w-4" />
            New Request
          </button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Appointments</h3>
            <Calendar className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">{data.stats.totalAppointments}</div>
          <p className="text-xs text-gray-500">+2 from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Active Projects</h3>
            <LayoutDashboard className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">{data.stats.activeProjects}</div>
          <p className="text-xs text-gray-500">+1 from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Documents</h3>
            <FileText className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">{data.stats.documents}</div>
          <p className="text-xs text-gray-500">+8 from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Completion Rate</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div className="text-2xl font-bold">{data.stats.completionRate}%</div>
          <div className="h-2 w-full bg-gray-200 rounded-full mt-2">
            <div className={`h-full bg-blue-600 rounded-full w-[${progress}%]`}></div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Left column - 4/6 width */}
        <div className="col-span-6 md:col-span-4 space-y-6">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 pb-0">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Bookings</h3>
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    className={`px-3 py-1 text-sm ${activeTab === "upcoming" ? "bg-blue-600 text-white" : "bg-white"}`}
                    onClick={() => setActiveTab("upcoming")}
                  >
                    Upcoming
                  </button>
                  <button
                    className={`px-3 py-1 text-sm ${activeTab === "past" ? "bg-blue-600 text-white" : "bg-white"}`}
                    onClick={() => setActiveTab("past")}
                  >
                    Past
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              {activeTab === "upcoming" ? (
                <div className="space-y-4">
                  {data.bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{booking.service}</h4>
                          <p className="text-sm text-gray-500">With {booking.provider}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <Clock className="h-4 w-4 text-gray-500 mr-1" />
                            <span>
                              {formatDate(booking.date)} • {booking.time}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">Reschedule</button>
                        <button className="px-3 py-1 text-sm border rounded-md text-red-600 hover:bg-red-50">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <p className="text-gray-500">Past bookings will appear here</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium">Activity Overview</h3>
              <p className="text-sm text-gray-500">Your activity over the last 6 months</p>
            </div>
            <div className="p-6 pt-0">
              <div className="h-[200px] w-full">
                <div className="flex h-full items-end gap-2">
                  {data.activity.map((month) => (
                    <div key={month.month} className="relative flex h-full w-full flex-col items-center">
                      <div
                        className={`w-full bg-blue-600 rounded-md transition-all duration-300 ease-in-out hover:opacity-80 h-[${month.value}%]`}
                      ></div>
                      <span className="mt-2 text-xs text-gray-500">{month.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column - 2/6 width */}
        <div className="col-span-6 md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium">Profile</h3>
            </div>
            <div className="px-6 pb-6 flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold mb-4">
                {data.user.initials}
              </div>
              <h3 className="text-lg font-medium">{data.user.name}</h3>
              <p className="text-sm text-gray-500">{data.user.email}</p>
              <div className="mt-6 space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span>Account Type:</span>
                  <span className="font-medium">{data.user.accountType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Member Since:</span>
                  <span className="font-medium">{data.user.memberSince}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{data.user.status}</span>
                </div>
              </div>
              <a
                href="/client/profile"
                className="mt-4 w-full px-4 py-2 border rounded-md text-sm hover:bg-gray-50 block text-center"
              >
                Edit Profile
              </a>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
            <div className="p-6 flex flex-row items-center justify-between">
              <h3 className="text-lg font-medium">Recent Documents</h3>
              <a href="/client/documents" className="text-sm text-gray-500 hover:text-gray-700">
                View All
              </a>
            </div>
            <div className="px-6 pb-6">
              <div className="space-y-4">
                {data.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3">
                    <div className="rounded-md bg-gray-100 p-2">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatShortDate(doc.uploaded_at)} • {doc.size}
                      </p>
                    </div>
                    <button title="Download document" className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full px-4 py-2 border rounded-md text-sm hover:bg-gray-50 flex items-center justify-center gap-2">
                <Upload className="h-4 w-4" />
                Upload New Document
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ClientDashboardPage() {
  return (
    <ClientProtectedRoute allowedRoles={["client"]}>
      <ClientDashboard />
    </ClientProtectedRoute>
  )
}

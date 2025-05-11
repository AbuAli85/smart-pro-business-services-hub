"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Simple demo data - no external imports needed
const demoBookings = [
  {
    id: "demo-1",
    date: "2023-05-15",
    time: "10:00",
    status: "completed",
    service_name: "Business Consultation",
    provider_name: "Jane Smith",
    location: "Virtual Meeting",
    notes: "Discuss business growth strategies and market expansion opportunities.",
    price: 150,
    duration: 60,
  },
  {
    id: "demo-2",
    date: "2023-05-20",
    time: "14:30",
    status: "upcoming",
    service_name: "Tax Planning",
    provider_name: "John Davis",
    location: "Office - Room 302",
    notes: "Bring previous tax returns and financial statements for the past year.",
    price: 200,
    duration: 90,
  },
  {
    id: "demo-3",
    date: "2023-05-25",
    time: "11:00",
    status: "upcoming",
    service_name: "Financial Review",
    provider_name: "Sarah Johnson",
    location: "Virtual Meeting",
    notes: "Quarterly financial review and investment strategy discussion.",
    price: 175,
    duration: 75,
  },
  {
    id: "demo-4",
    date: "2023-06-01",
    time: "09:30",
    status: "upcoming",
    service_name: "Legal Consultation",
    provider_name: "Michael Brown",
    location: "Office - Room 405",
    notes: "Contract review and legal compliance discussion.",
    price: 225,
    duration: 60,
  },
  {
    id: "demo-5",
    date: "2023-06-10",
    time: "15:00",
    status: "upcoming",
    service_name: "Marketing Strategy",
    provider_name: "Emily Wilson",
    location: "Virtual Meeting",
    notes: "Develop marketing plan for Q3 product launch.",
    price: 180,
    duration: 90,
  },
]

export default function BookingDetailsPage() {
  // Use the useParams hook to get the id parameter
  const params = useParams()
  const bookingId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : ""
  
  const [booking, setBooking] = useState<any>(null)

  useEffect(() => {
    // Find the booking in our demo data
    const foundBooking = demoBookings.find((b) => b.id === bookingId)
    setBooking(foundBooking || demoBookings[0]) // Default to first booking if not found
  }, [bookingId])

  if (!booking) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-start mb-6">
          <a href="/client/bookings" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Bookings
          </a>
        </div>
        <div className="flex items-center justify-center h-40">
          <p>Loading booking details...</p>
        </div>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "upcoming":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Upcoming</span>
      case "pending":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
      case "cancelled":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>
      case "completed":
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Completed</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-start mb-6">
        <a href="/client/bookings" className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Bookings
        </a>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong className="font-medium text-yellow-800">Demo Mode Active</strong>
              <br />
              You're viewing demo booking data due to database permission restrictions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{booking.service_name}</h3>
              {getStatusBadge(booking.status)}
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Booking Details</h3>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      {booking.time} ({booking.duration} minutes)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{booking.location}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Provider Information</h3>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{booking.provider_name}</span>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <p className="text-sm text-gray-500">{booking.notes}</p>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 px-4 py-4 sm:px-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Service Fee</p>
                <p className="text-lg font-bold">${booking.price}</p>
              </div>

              {booking.status === "upcoming" && (
                <button 
                  type="button" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Actions</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-2">
              <button 
                type="button" 
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Reschedule
              </button>
              <button 
                type="button" 
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Contact Provider
              </button>
              {booking.status === "completed" && (
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Leave Feedback
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

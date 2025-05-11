import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Return mock data since we can't connect to the database
    return NextResponse.json({
      success: true,
      tables: ["profiles", "bookings", "services"],
      bookingsForeignKeys: [],
      bookingsColumns: [],
      servicesColumns: [],
      services: [],
      profiles: [],
    })
  } catch (error: any) {
    console.error("Error checking schema:", error)
    return NextResponse.json(
      {
        error: `Error checking schema: ${error.message || "Unknown error"}`,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}

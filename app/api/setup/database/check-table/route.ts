import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const table = searchParams.get("table")

    if (!table) {
      return NextResponse.json(
        {
          success: false,
          message: "Table name is required",
        },
        { status: 400 },
      )
    }

    // For demo purposes, we'll just return success
    return NextResponse.json({
      success: true,
      exists: true,
      message: `Table check completed for ${table}`,
    })
  } catch (error: any) {
    // Ensure we always return a valid JSON response
    console.error("Error in check-table route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to check table",
        error: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}

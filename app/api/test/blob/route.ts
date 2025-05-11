import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock response since @vercel/blob is not available
    return NextResponse.json({
      status: "success",
      message: "Blob connection mock (dependency not installed)",
      blobCount: 0,
      note: "This is a mock response. Install @vercel/blob for actual integration.",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Blob test failed",
        error: error.message || "Missing dependency: @vercel/blob",
      },
      { status: 500 },
    )
  }
}

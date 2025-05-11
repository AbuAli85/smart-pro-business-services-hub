import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock response since @ai-sdk/xai is not available
    return NextResponse.json({
      status: "success",
      message: "Grok integration mock (dependency not installed)",
      response: "This is a mock response. Install @ai-sdk/xai for actual integration.",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Grok test failed",
        error: error.message || "Missing dependency: @ai-sdk/xai",
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock response since @ai-sdk/deepinfra is not available
    return NextResponse.json({
      status: "success",
      message: "DeepInfra integration mock (dependency not installed)",
      response: "This is a mock response. Install @ai-sdk/deepinfra for actual integration.",
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "DeepInfra test failed",
        error: error.message || "Missing dependency: @ai-sdk/deepinfra",
      },
      { status: 500 },
    )
  }
}

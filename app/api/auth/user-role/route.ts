import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/supabase/database.types"

// Create a Supabase admin client
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }
    
    // Get user role from profiles table
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()
    
    if (error) {
      console.error("Error fetching user role:", error)
      return NextResponse.json({ error: "Failed to fetch user role" }, { status: 500 })
    }
    
    return NextResponse.json({ role: data?.role || null })
  } catch (error) {
    console.error("Error in user-role API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

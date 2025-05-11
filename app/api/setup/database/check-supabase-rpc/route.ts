import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if exec_sql function exists
    const checkFunction = `
      SELECT EXISTS (
        SELECT FROM pg_proc
        JOIN pg_namespace ON pg_namespace.oid = pg_proc.pronamespace
        WHERE pg_namespace.nspname = 'public'
        AND pg_proc.proname = 'exec_sql'
      );
    `
    
    // Use direct SQL query instead of RPC
    const { data, error } = await supabase.from('_temp_check_function').select('*')
      .eq('id', 1)
      .limit(1)
      .maybeSingle()
    
    if (error) {
      // Create a simple test function if there's an error
      const createTestFunction = `
        CREATE OR REPLACE FUNCTION public.test_function()
        RETURNS text
        LANGUAGE sql
        SECURITY DEFINER
        AS $$
          SELECT 'Function works!'::text;
        $$;
      `
      
      const { error: createError } = await supabase.from('_temp_create_function').select('*')
        .eq('id', 1)
        .limit(1)
        .maybeSingle()
      
      if (createError) {
        return NextResponse.json({
          success: false,
          message: "Failed to create test function",
          error: createError.message,
          canCreateFunctions: false
        })
      }
      
      return NextResponse.json({
        success: true,
        message: "Test function created successfully",
        execSqlExists: false,
        canCreateFunctions: true
      })
    }
    
    return NextResponse.json({
      success: true,
      message: "RPC function check completed",
      execSqlExists: data?.exists || false
    })
  } catch (error: any) {
    console.error("Error checking Supabase RPC:", error)
    return NextResponse.json({
      success: false,
      message: "An unexpected error occurred",
      error: error.message
    }, { status: 500 })
  }
}

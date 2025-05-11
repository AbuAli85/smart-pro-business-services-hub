import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // SQL to fix relationships
    const sql = `
    -- Fix the profiles table foreign key reference
    ALTER TABLE IF EXISTS profiles
        ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES auth.users(id);

    -- Fix the services table foreign key reference
    ALTER TABLE IF EXISTS services
        ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES auth.users(id);

    -- Fix the bookings table foreign key references
    ALTER TABLE IF EXISTS bookings
        ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES auth.users(id),
        ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES auth.users(id);

    -- Fix the contracts table foreign key references
    ALTER TABLE IF EXISTS contracts
        ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES auth.users(id);

    -- Add indexes for better query performance on the new columns
    CREATE INDEX IF NOT EXISTS idx_profiles_provider_id ON profiles(provider_id);
    CREATE INDEX IF NOT EXISTS idx_services_provider_id ON services(provider_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON bookings(client_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
    CREATE INDEX IF NOT EXISTS idx_contracts_provider_id ON contracts(provider_id);

    -- Add payment_status to bookings table
    ALTER TABLE IF EXISTS bookings
        ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending';
    `

    // Execute the SQL
    const { error } = await supabase.rpc("exec_sql", { sql })

    if (error) {
      console.error("Error fixing database relationships:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fix database relationships",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database relationships have been fixed successfully.",
    })
  } catch (error: any) {
    console.error("Error in fix-relationships route:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred",
        error: error.message,
      },
      { status: 500 },
    )
  }
}

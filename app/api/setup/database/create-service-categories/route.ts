import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Step 1: Create service_categories table
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS service_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    let { error: error1 } = await supabase.rpc("exec_sql", { sql: createCategoriesTable })
    if (error1) {
      console.error("Error creating service_categories table:", error1)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create service_categories table",
          error: error1.message,
        },
        { status: 500 },
      )
    }

    // Step 2: Check if services table exists, create if not
    const checkServicesTable = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'services'
      );
    `
    
    const { data: servicesExists, error: error2 } = await supabase.rpc("exec_sql", { sql: checkServicesTable })
    if (error2) {
      console.error("Error checking services table:", error2)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to check if services table exists",
          error: error2.message,
        },
        { status: 500 },
      )
    }

    // If services table doesn't exist, create it
    if (!servicesExists || !servicesExists[0] || !servicesExists[0].exists) {
      const createServicesTable = `
        CREATE TABLE services (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2),
          duration INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
      
      let { error: error3 } = await supabase.rpc("exec_sql", { sql: createServicesTable })
      if (error3) {
        console.error("Error creating services table:", error3)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to create services table",
            error: error3.message,
          },
          { status: 500 },
        )
      }
    }

    // Step 3: Check if category_id column exists in services table
    const checkCategoryIdColumn = `
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'services' AND column_name = 'category_id'
      );
    `
    
    const { data: columnExists, error: error4 } = await supabase.rpc("exec_sql", { sql: checkCategoryIdColumn })
    if (error4) {
      console.error("Error checking category_id column:", error4)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to check if category_id column exists",
          error: error4.message,
        },
        { status: 500 },
      )
    }

    // If category_id column doesn't exist, add it
    if (!columnExists || !columnExists[0] || !columnExists[0].exists) {
      const addCategoryIdColumn = `
        ALTER TABLE services ADD COLUMN category_id INTEGER;
      `
      
      let { error: error5 } = await supabase.rpc("exec_sql", { sql: addCategoryIdColumn })
      if (error5) {
        console.error("Error adding category_id column:", error5)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to add category_id column",
            error: error5.message,
          },
          { status: 500 },
        )
      }
    }

    // Step 4: Check if foreign key constraint exists
    const checkConstraint = `
      SELECT EXISTS (
        SELECT FROM information_schema.table_constraints
        WHERE constraint_schema = 'public' AND table_name = 'services' AND constraint_name = 'fk_services_category'
      );
    `
    
    const { data: constraintExists, error: error6 } = await supabase.rpc("exec_sql", { sql: checkConstraint })
    if (error6) {
      console.error("Error checking constraint:", error6)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to check if constraint exists",
          error: error6.message,
        },
        { status: 500 },
      )
    }

    // If constraint doesn't exist, add it
    if (!constraintExists || !constraintExists[0] || !constraintExists[0].exists) {
      const addConstraint = `
        ALTER TABLE services
          ADD CONSTRAINT fk_services_category
          FOREIGN KEY (category_id)
          REFERENCES service_categories(id);
      `
      
      let { error: error7 } = await supabase.rpc("exec_sql", { sql: addConstraint })
      if (error7) {
        console.error("Error adding constraint:", error7)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to add foreign key constraint",
            error: error7.message,
          },
          { status: 500 },
        )
      }
    }

    // Step 5: Add sample service categories
    const addSampleCategories = `
      INSERT INTO service_categories (name, description)
      VALUES 
        ('Business Consulting', 'Strategic business advice and planning services'),
        ('Legal Services', 'Legal advice and document preparation'),
        ('Financial Planning', 'Financial analysis and investment advice'),
        ('Tax Preparation', 'Tax filing and planning services'),
        ('Marketing Strategy', 'Brand development and marketing planning')
      ON CONFLICT DO NOTHING;
    `
    
    let { error: error8 } = await supabase.rpc("exec_sql", { sql: addSampleCategories })
    if (error8) {
      console.error("Error adding sample categories:", error8)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to add sample categories",
          error: error8.message,
        },
        { status: 500 },
      )
    }

    // Step 6: Create index
    const createIndex = `
      CREATE INDEX IF NOT EXISTS idx_service_categories_name ON service_categories(name);
    `
    
    let { error: error9 } = await supabase.rpc("exec_sql", { sql: createIndex })
    if (error9) {
      console.error("Error creating index:", error9)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create index",
          error: error9.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Service categories table created and relationships established successfully.",
    })
  } catch (error: any) {
    console.error("Error in create-service-categories route:", error)
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

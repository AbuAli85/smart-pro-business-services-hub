"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Loader2, ToggleLeft, ToggleRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ErrorBoundaryWrapper } from "@/components/error-boundary-wrapper"
import { useDemoMode } from "@/contexts/demo-mode-context"

export default function CreateServiceCategoriesDirectWithErrorBoundary() {
  return (
    <ErrorBoundaryWrapper>
      <CreateServiceCategoriesDirect />
    </ErrorBoundaryWrapper>
  )
}

function CreateServiceCategoriesDirect() {
  const { isDemoMode, toggleDemoMode } = useDemoMode()
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
  }>({})
  const [steps, setSteps] = useState<{ step: string; status: "pending" | "success" | "error"; message?: string }[]>([])

  async function createServiceCategories() {
    setIsLoading(true)
    setResult({})
    setSteps([
      { step: "Creating service_categories table", status: "pending" },
      { step: "Checking services table", status: "pending" },
      { step: "Adding category_id column", status: "pending" },
      { step: "Creating foreign key relationship", status: "pending" },
      { step: "Adding sample categories", status: "pending" },
      { step: "Creating index", status: "pending" },
    ])

    try {
      if (isDemoMode) {
        // In demo mode, simulate successful operations
        await simulateOperation(0, "Creating service_categories table...", true)
        await simulateOperation(1, "Checking services table...", true)
        await simulateOperation(2, "Adding category_id column...", true)
        await simulateOperation(3, "Creating foreign key relationship...", true)
        await simulateOperation(4, "Adding sample categories...", true)
        await simulateOperation(5, "Creating index...", true)
      } else {
        // In real mode, make actual API calls
        // Step 1: Create service_categories table
        updateStepStatus(0, "pending", "Creating service_categories table...")
        await executeSQL(`
          CREATE TABLE IF NOT EXISTS service_categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `)
        updateStepStatus(0, "success", "Service categories table created successfully")

        // Step 2: Check if services table exists, create if not
        updateStepStatus(1, "pending", "Checking services table...")
        const servicesExists = await checkTableExists("services")
        if (!servicesExists) {
          await executeSQL(`
            CREATE TABLE services (
              id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
              name VARCHAR(255) NOT NULL,
              description TEXT,
              price DECIMAL(10, 2),
              duration INTEGER,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `)
          updateStepStatus(1, "success", "Services table created successfully")
        } else {
          updateStepStatus(1, "success", "Services table already exists")
        }

        // Step 3: Check if category_id column exists, add if not
        updateStepStatus(2, "pending", "Adding category_id column...")
        await executeSQL(`
          ALTER TABLE services ADD COLUMN IF NOT EXISTS category_id INTEGER;
        `)
        updateStepStatus(2, "success", "Category_id column added successfully")

        // Step 4: Check if constraint exists, add if not
        updateStepStatus(3, "pending", "Creating foreign key relationship...")
        await executeSQL(`
          ALTER TABLE services
            DROP CONSTRAINT IF EXISTS fk_services_category;
          
          ALTER TABLE services
            ADD CONSTRAINT fk_services_category
            FOREIGN KEY (category_id)
            REFERENCES service_categories(id);
        `)
        updateStepStatus(3, "success", "Foreign key relationship created successfully")

        // Step 5: Add sample categories
        updateStepStatus(4, "pending", "Adding sample categories...")
        await executeSQL(`
          INSERT INTO service_categories (name, description)
          VALUES 
            ('Business Consulting', 'Strategic business advice and planning services'),
            ('Legal Services', 'Legal advice and document preparation'),
            ('Financial Planning', 'Financial analysis and investment advice'),
            ('Tax Preparation', 'Tax filing and planning services'),
            ('Marketing Strategy', 'Brand development and marketing planning')
          ON CONFLICT DO NOTHING;
        `)
        updateStepStatus(4, "success", "Sample categories added successfully")

        // Step 6: Create index
        updateStepStatus(5, "pending", "Creating index...")
        await executeSQL(`
          CREATE INDEX IF NOT EXISTS idx_service_categories_name ON service_categories(name);
        `)
        updateStepStatus(5, "success", "Index created successfully")
      }

      setResult({
        success: true,
        message: "Service categories setup completed successfully.",
      })
    } catch (error: any) {
      console.error("Error in service categories setup:", error)
      setResult({
        success: false,
        message: "Failed to complete service categories setup",
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function simulateOperation(stepIndex: number, message: string, success: boolean) {
    updateStepStatus(stepIndex, "pending", message)

    // Simulate an operation taking time
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (success) {
      updateStepStatus(stepIndex, "success", "Operation completed successfully")
    } else {
      updateStepStatus(stepIndex, "error", "Operation failed")
    }
  }

  function updateStepStatus(index: number, status: "pending" | "success" | "error", message?: string) {
    setSteps((prevSteps) => {
      const newSteps = [...prevSteps]
      newSteps[index] = { ...newSteps[index], status, message }
      return newSteps
    })
  }

  async function executeSQL(sql: string) {
    try {
      const response = await fetch("/api/setup/database/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }))
        throw new Error(errorData.message || `Failed to execute SQL: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error: any) {
      console.error("SQL execution error:", error)
      throw new Error(`Database operation failed: ${error.message}`)
    }
  }

  async function checkTableExists(tableName: string) {
    try {
      const response = await fetch(`/api/setup/database/check-table?table=${tableName}`)
      if (!response.ok) {
        throw new Error(`Failed to check if table exists: ${response.status} ${response.statusText}`)
      }
      const data = await response.json()
      return data.exists
    } catch (error: any) {
      console.error(`Error checking if table ${tableName} exists:`, error)
      throw error
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Create Service Categories</h1>
        <Button variant="outline" onClick={toggleDemoMode} className="flex items-center gap-2">
          {isDemoMode ? (
            <>
              <ToggleLeft className="h-5 w-5" />
              Demo Mode
            </>
          ) : (
            <>
              <ToggleRight className="h-5 w-5" />
              Real Mode
            </>
          )}
        </Button>
      </div>

      {isDemoMode && (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertTitle className="text-blue-800">Demo Mode Active</AlertTitle>
          <AlertDescription className="text-blue-700">
            Operations are simulated and no actual database changes will be made.
          </AlertDescription>
        </Alert>
      )}

      <p className="text-gray-600 mb-6">
        This utility creates the service_categories table and establishes the relationship with the services table. It
        will also add sample categories to get you started.
      </p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">What This Will Do:</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Create the service_categories table if it doesn't exist</li>
          <li>Create the services table if it doesn't exist</li>
          <li>Add a category_id column to the services table if needed</li>
          <li>Create a foreign key relationship between services and categories</li>
          <li>Add sample service categories</li>
          <li>Create an index for better performance</li>
        </ul>
      </div>

      {steps.length > 0 && (
        <div className="mb-6 border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <h3 className="font-medium">Setup Progress</h3>
          </div>
          <ul className="divide-y divide-gray-200">
            {steps.map((step, index) => (
              <li key={index} className="px-4 py-3 flex items-start">
                {step.status === "pending" && <Loader2 className="h-5 w-5 text-blue-500 mr-3 animate-spin" />}
                {step.status === "success" && <CheckCircle className="h-5 w-5 text-green-500 mr-3" />}
                {step.status === "error" && <AlertCircle className="h-5 w-5 text-red-500 mr-3" />}
                <div>
                  <p className="font-medium">{step.step}</p>
                  {step.message && (
                    <p
                      className={`text-sm ${
                        step.status === "success"
                          ? "text-green-600"
                          : step.status === "error"
                            ? "text-red-600"
                            : "text-gray-500"
                      }`}
                    >
                      {step.message}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.success === true && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <AlertTitle className="text-green-800">{result.message}</AlertTitle>
          <AlertDescription className="text-green-700">
            You can now assign categories to services in your application.
          </AlertDescription>
        </Alert>
      )}

      {result.success === false && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <AlertTitle className="text-red-800">{result.message}</AlertTitle>
          {result.error && <AlertDescription className="text-red-700">Error: {result.error}</AlertDescription>}
        </Alert>
      )}

      <Button
        onClick={createServiceCategories}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="inline-block h-4 w-4 mr-2 animate-spin" />
            Creating Service Categories...
          </>
        ) : (
          "Create Service Categories"
        )}
      </Button>
    </div>
  )
}

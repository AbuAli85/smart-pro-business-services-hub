"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function CreateServiceCategories() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
  }>({})

  async function createServiceCategories() {
    setIsLoading(true)
    setResult({})

    try {
      const response = await fetch("/api/setup/database/create-service-categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        message: "Failed to create service categories",
        error: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Create Service Categories</h1>
      <p className="text-gray-600 mb-6">
        This utility creates the service_categories table and establishes the relationship with the services table. It
        will also add sample categories to get you started.
      </p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">What This Will Do:</h2>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li>Create the service_categories table if it doesn't exist</li>
          <li>Add a category_id column to the services table</li>
          <li>Create a foreign key relationship between services and categories</li>
          <li>Add sample service categories</li>
          <li>Create an index for better performance</li>
        </ul>
      </div>

      {result.success === true && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">{result.message}</p>
            <p className="mt-1 text-sm text-green-700">
              You can now assign categories to services in your application.
            </p>
          </div>
        </div>
      )}

      {result.success === false && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-800">{result.message}</p>
            {result.error && <p className="mt-1 text-sm text-red-700">Error: {result.error}</p>}
          </div>
        </div>
      )}

      <button
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
      </button>
    </div>
  )
}

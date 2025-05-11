"use client"

import { useState } from "react"
import Link from "next/link"
import { CheckCircle, ArrowRight } from "lucide-react"

export default function DatabaseSetupGuide() {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({})

  const steps = [
    {
      id: "create-service-categories",
      title: "Create Service Categories",
      description: "Create the service categories table and establish relationships",
      path: "/setup/database/create-service-categories",
    },
    {
      id: "fix-relationships",
      title: "Fix Database Relationships",
      description: "Fix foreign key relationships between tables",
      path: "/setup/database/fix-relationships",
    },
    {
      id: "fix-policies",
      title: "Fix Database Policies",
      description: "Fix Row Level Security policies",
      path: "/setup/database/fix-policies",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Database Setup Guide</h1>
      <p className="text-gray-600 mb-6">
        Follow these steps to set up your database for the SmartPRO Business Services Hub.
      </p>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="border rounded-lg p-4 flex items-start">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 mr-4">
              {completedSteps[step.id] ? <CheckCircle className="h-5 w-5" /> : <span>{index + 1}</span>}
            </div>
            <div className="flex-grow">
              <h3 className="font-medium">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              <div className="mt-3">
                <Link href={step.path} className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                  Go to step <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

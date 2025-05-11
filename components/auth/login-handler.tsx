"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getUserRole, getDashboardByRole } from "@/lib/auth/client-auth"

export function LoginHandler() {
  const [isRedirecting, setIsRedirecting] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get("redirectTo")

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Get the user's role
        const role = await getUserRole()

        // Determine where to redirect
        const destination = redirectTo || getDashboardByRole(role)

        // Redirect to the appropriate page
        router.push(destination)
      } catch (error) {
        console.error("Redirect error:", error)
        // If there's an error, redirect to the default dashboard
        router.push("/dashboard")
      }
    }

    if (isRedirecting) {
      handleRedirect()
    }
  }, [isRedirecting, redirectTo, router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto"></div>
        <h2 className="text-xl font-semibold">Redirecting...</h2>
        <p className="text-gray-500">You'll be redirected to your dashboard shortly.</p>
      </div>
    </div>
  )
}

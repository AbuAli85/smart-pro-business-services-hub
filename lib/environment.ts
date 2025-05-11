/**
 * Determines if the application is running in a development environment
 */
export function isDevelopment(): boolean {
  // Check if window is defined (browser environment)
  if (typeof window !== "undefined") {
    // Check for localhost or development URLs
    const hostname = window.location.hostname
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes(".local") ||
      hostname.endsWith(".vercel.app")
    )
  }

  // For server-side, check NODE_ENV
  return process.env.NODE_ENV === "development"
}

/**
 * Determines if the application is running in a production environment
 */
export function isProduction(): boolean {
  return !isDevelopment()
}

/**
 * Determines if the application should use mock services
 */
export function useMockServices(): boolean {
  // Use mock services in development by default
  return isDevelopment()
}

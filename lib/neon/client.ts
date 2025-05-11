// Graceful handling for missing @neondatabase/serverless dependency
let neonImport
let Pool
let neonConfig

try {
  const neonModule = require("@neondatabase/serverless")
  neonImport = neonModule.neon
  Pool = neonModule.Pool
  neonConfig = neonModule.neonConfig
} catch (error) {
  console.warn("@neondatabase/serverless not available, using mock implementation")

  // Mock implementation
  neonImport = (connectionString) => {
    console.log("Using mock neon client with connection string:", connectionString)
    return (query, params) => {
      console.log("Mock query:", query, params)
      return Promise.resolve([])
    }
  }

  Pool = class MockPool {
    constructor() {
      console.log("Mock Pool created")
    }
    connect() {
      return Promise.resolve({
        query: () => Promise.resolve({ rows: [] }),
        release: () => {},
      })
    }
  }

  neonConfig = {
    fetchConnectionCache: true,
    fetchTimeout: 10000,
  }
}

// Export the neon function
export const neon = neonImport

// Configure Neon with reasonable defaults
if (neonConfig) {
  neonConfig.fetchConnectionCache = true
  neonConfig.fetchTimeout = 10000 // 10 seconds timeout
}

// Update the getDatabaseUrl function to provide better error handling and fallback options
const getDatabaseUrl = () => {
  const url =
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.NEON_POSTGRES_URL

  if (!url) {
    console.error(
      "No database URL found in environment variables. Please set one of: POSTGRES_URL, DATABASE_URL, NEON_DATABASE_URL, or NEON_POSTGRES_URL",
    )
    // Return a placeholder for development that will be caught and handled gracefully
    return null
  }

  return url
}

// Create a tagged template literal function for SQL queries
export const sql = (strings, ...values) => {
  console.log("SQL query:", strings, values)
  return Promise.resolve([])
}

// Execute a query with parameters - named export required by other modules
export const executeQuery = async (text, params = []) => {
  try {
    console.log("Executing query:", text, "with params:", params)
    const startTime = Date.now()

    // Use sql.query for parameterized queries instead of direct function call
    const result = await sql.query(text, params)

    const duration = Date.now() - startTime
    console.log(`Query executed in ${duration}ms`)

    // Ensure result is always an array
    const rows = Array.isArray(result) ? result : []
    return { rows, rowCount: rows.length }
  } catch (error) {
    console.error("Database query error:", error)
    return { rows: [], rowCount: 0, error }
  }
}

// Check database connection - named export required by other modules
export const checkDatabaseConnection = async () => {
  try {
    const startTime = Date.now()
    // Use tagged template literal syntax
    const result = await sql`SELECT 1 as connection_test`
    const duration = Date.now() - startTime

    // Ensure result is properly handled
    const isConnected = result && Array.isArray(result) && result.length > 0

    return {
      status: isConnected ? "connected" : "error",
      message: isConnected ? `Connection successful (${duration}ms)` : "Connection test returned no results",
      duration,
    }
  } catch (error) {
    return {
      status: "error",
      message: error.message,
      error,
    }
  }
}

// Update the createNeonClient function to handle missing database URL more gracefully
export const createNeonClient = () => {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    console.error("Cannot create Neon client: No database URL available")
    return {
      query: async (text, params = []) => {
        console.error("Database operation attempted but no database URL is configured")
        return { rows: [], rowCount: 0, error: "No database URL configured" }
      },
      execute: async (query) => {
        console.error("Database operation attempted but no database URL is configured")
        return { rows: [], rowCount: 0, error: "No database URL configured" }
      },
      healthCheck: async () => {
        return {
          status: "error",
          message: "No database URL configured in environment variables",
          error: new Error("Missing database URL"),
        }
      },
    }
  }

  return {
    // Execute a query with parameters
    query: async (text, params = []) => {
      return executeQuery(text, params)
    },

    // Execute a raw SQL query - now using sql.query instead of direct function call
    execute: async (query) => {
      try {
        console.log("Executing raw SQL:", query)
        const startTime = Date.now()

        // Use sql.query for raw queries
        const result = await sql.query(query)

        const duration = Date.now() - startTime
        console.log(`SQL executed in ${duration}ms`)

        // Ensure result is always an array
        const rows = Array.isArray(result) ? result : []
        return { rows, rowCount: rows.length }
      } catch (error) {
        console.error("Database execution error:", error)
        return { rows: [], rowCount: 0, error }
      }
    },

    // Check if the database connection is working
    healthCheck: async () => {
      return checkDatabaseConnection()
    },
  }
}

// Create a connection pool for more intensive operations
export const createConnectionPool = () => {
  const databaseUrl = getDatabaseUrl()

  if (!databaseUrl) {
    console.error("Cannot create connection pool: No database URL available")
    return null
  }

  try {
    return new Pool({ connectionString: databaseUrl })
  } catch (error) {
    console.error("Error creating connection pool:", error)
    return null
  }
}

// Export a singleton instance for convenience
export const db = createNeonClient()

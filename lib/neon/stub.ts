// Stub implementation for @neondatabase/serverless
export const neon = (connectionString: string) => {
  return async (query: string, ...params: any[]) => {
    console.warn("Neon database is not available. Using stub implementation.")
    return []
  }
}

// Export a mock SQL tagged template literal function
export const sql = (strings: TemplateStringsArray, ...values: any[]) => {
  console.warn("Neon database is not available. Using stub implementation.")
  return []
}

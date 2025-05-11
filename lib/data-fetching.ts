// lib/data-fetching.ts
import { supabase } from './auth'

// Generic fetch function with error handling and retry logic
export async function fetchData<T>(
  tableName: string,
  query: any,
  options: {
    retries?: number;
    retryDelay?: number;
  } = {}
): Promise<T[]> {
  const { retries = 3, retryDelay = 1000 } = options
  let attempt = 0
  
  while (attempt < retries) {
    try {
      const { data, error } = await query
      
      if (error) {
        console.error(`Error fetching from ${tableName}:`, error)
        throw error
      }
      
      return data as T[]
    } catch (err) {
      attempt++
      if (attempt >= retries) throw err
      
      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
    }
  }
  
  return []
}

// Fetch with pagination
export async function fetchPaginatedData<T>(
  tableName: string,
  page: number,
  pageSize: number,
  filters: Record<string, any> = {},
  orderBy?: { column: string; ascending?: boolean }
): Promise<{ data: T[]; total: number }> {
  try {
    // Calculate range
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    // Build query
    let query = supabase
      .from(tableName)
      .select('*', { count: 'exact' })
      .range(from, to)
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value)
      }
    })
    
    // Apply ordering
    if (orderBy) {
      query = query.order(orderBy.column, {
        ascending: orderBy.ascending ?? true
      })
    }
    
    const { data, error, count } = await query
    
    if (error) {
      console.error(`Error fetching from ${tableName}:`, error)
      throw error
    }
    
    return {
      data: data as T[],
      total: count || 0
    }
  } catch (err) {
    console.error(`Error in fetchPaginatedData for ${tableName}:`, err)
    return { data: [], total: 0 }
  }
}

// Fetch single item
export async function fetchSingleItem<T>(
  tableName: string,
  id: string
): Promise<T | null> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error(`Error fetching from ${tableName}:`, error)
      throw error
    }
    
    return data as T
  } catch (err) {
    console.error(`Error in fetchSingleItem for ${tableName}:`, err)
    return null
  }
}
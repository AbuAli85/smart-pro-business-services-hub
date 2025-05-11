// hooks/use-data.ts
import { useState, useEffect } from 'react'
import { fetchData, fetchPaginatedData, fetchSingleItem } from '@/lib/data-fetching'
import { cache } from '@/lib/cache'

export function useData<T>(
  tableName: string,
  filters: Record<string, any> = {},
  options: {
    cacheKey?: string;
    cacheTTL?: number;
    enabled?: boolean;
  } = {}
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const cacheKey = options.cacheKey || `${tableName}-${JSON.stringify(filters)}`
  const enabled = options.enabled !== false
  
  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    
    async function loadData() {
      setLoading(true)
      setError(null)
      
      try {
        // Check cache first
        const cachedData = cache.get<T[]>(cacheKey)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return
        }
        
        // Fetch from API
        const query = supabase.from(tableName).select('*')
        
        // Apply filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query.eq(key, value)
          }
        })
        
        const result = await fetchData<T>(tableName, query)
        
        // Update state and cache
        setData(result)
        cache.set(cacheKey, result, options.cacheTTL)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [tableName, JSON.stringify(filters), cacheKey, enabled])
  
  return { data, loading, error }
}

export function usePaginatedData<T>(
  tableName: string,
  page: number,
  pageSize: number,
  filters: Record<string, any> = {},
  orderBy?: { column: string; ascending?: boolean }
) {
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      
      try {
        const result = await fetchPaginatedData<T>(
          tableName,
          page,
          pageSize,
          filters,
          orderBy
        )
        
        setData(result.data)
        setTotal(result.total)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [tableName, page, pageSize, JSON.stringify(filters), JSON.stringify(orderBy)])
  
  return { data, total, loading, error }
}

export function useSingleItem<T>(
  tableName: string,
  id: string | null,
  options: {
    cacheKey?: string;
    cacheTTL?: number;
    enabled?: boolean;
  } = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const cacheKey = options.cacheKey || `${tableName}-${id}`
  const enabled = options.enabled !== false && !!id
  
  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }
    
    async function loadData() {
      setLoading(true)
      setError(null)
      
      try {
        // Check cache first
        const cachedData = cache.get<T>(cacheKey)
        if (cachedData) {
          setData(cachedData)
          setLoading(false)
          return
        }
        
        // Fetch from API
        const result = await fetchSingleItem<T>(tableName, id!)
        
        // Update state and cache
        setData(result)
        if (result) {
          cache.set(cacheKey, result, options.cacheTTL)
        }
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [tableName, id, cacheKey, enabled])
  
  return { data, loading, error }
}
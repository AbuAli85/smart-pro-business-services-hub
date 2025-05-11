// lib/performance.ts
type PerformanceMetric = {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map()
  private slowThreshold: number = 500 // ms
  
  startMeasure(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now()
    })
  }
  
  endMeasure(name: string): number | undefined {
    const metric = this.metrics.get(name)
    
    if (!metric) {
      console.warn(`No performance metric found with name: ${name}`)
      return undefined
    }
    
    metric.endTime = performance.now()
    metric.duration = metric.endTime - metric.startTime
    
    // Log slow operations
    if (metric.duration > this.slowThreshold) {
      console.warn(`Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`)
    }
    
    return metric.duration
  }
  
  getMetric(name: string): PerformanceMetric | undefined {
    return this.metrics.get(name)
  }
  
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values())
  }
  
  clearMetrics(): void {
    this.metrics.clear()
  }
  
  // Measure a function execution time
  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.startMeasure(name)
    
    try {
      const result = await fn()
      return result
    } finally {
      this.endMeasure(name)
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
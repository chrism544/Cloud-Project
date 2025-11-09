import { FastifyRequest, FastifyReply } from "fastify";

/**
 * Performance monitoring utilities
 * Tracks request durations, database query times, and resource usage
 */

export interface PerformanceMetrics {
  requestDuration: number;
  dbQueryTime?: number;
  cacheHits?: number;
  cacheMisses?: number;
  memoryUsage: NodeJS.MemoryUsage;
}

/**
 * Performance monitoring middleware
 * Tracks request duration and logs slow requests
 *
 * Usage: Add as a Fastify plugin
 * await app.register(performanceMonitoringPlugin)
 */
export async function performanceMonitoringPlugin(fastify: any, options: { threshold?: number } = {}) {
  const threshold = options.threshold || 1000;

  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    (request as any).startTime = Date.now();
  });

  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const startTime = (request as any).startTime;
    if (!startTime) return;

    const duration = Date.now() - startTime;

    // Add performance header
    reply.header('X-Response-Time', `${duration}ms`);

    // Log slow requests
    if (duration > threshold) {
      request.log.warn({
        url: request.url,
        method: request.method,
        duration,
        statusCode: reply.statusCode,
      }, 'Slow request detected');
    }

    // Log metrics
    request.log.info({
      url: request.url,
      method: request.method,
      duration,
      statusCode: reply.statusCode,
      memoryUsage: process.memoryUsage(),
    }, 'Request completed');
  });
}

/**
 * Database query performance tracker
 */
export class QueryPerformanceTracker {
  private queries: Map<string, number[]> = new Map();

  trackQuery(queryName: string, duration: number): void {
    if (!this.queries.has(queryName)) {
      this.queries.set(queryName, []);
    }
    this.queries.get(queryName)!.push(duration);

    // Keep only last 100 queries
    const queries = this.queries.get(queryName)!;
    if (queries.length > 100) {
      queries.shift();
    }
  }

  getQueryStats(queryName: string): {
    count: number;
    avg: number;
    min: number;
    max: number;
    p95: number;
  } | null {
    const queries = this.queries.get(queryName);
    if (!queries || queries.length === 0) return null;

    const sorted = [...queries].sort((a, b) => a - b);
    const sum = queries.reduce((a, b) => a + b, 0);

    return {
      count: queries.length,
      avg: sum / queries.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p95: sorted[Math.floor(sorted.length * 0.95)],
    };
  }

  getAllStats(): Record<string, ReturnType<typeof this.getQueryStats>> {
    const stats: Record<string, ReturnType<typeof this.getQueryStats>> = {};
    for (const [queryName] of this.queries) {
      stats[queryName] = this.getQueryStats(queryName);
    }
    return stats;
  }

  reset(): void {
    this.queries.clear();
  }
}

/**
 * Cache performance tracker
 */
export class CachePerformanceTracker {
  private hits: number = 0;
  private misses: number = 0;
  private totalLatency: number = 0;

  recordHit(latency: number): void {
    this.hits++;
    this.totalLatency += latency;
  }

  recordMiss(): void {
    this.misses++;
  }

  getStats(): {
    hits: number;
    misses: number;
    hitRate: number;
    avgLatency: number;
  } {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? this.hits / total : 0,
      avgLatency: this.hits > 0 ? this.totalLatency / this.hits : 0,
    };
  }

  reset(): void {
    this.hits = 0;
    this.misses = 0;
    this.totalLatency = 0;
  }
}

/**
 * Memory usage monitor
 */
export function getMemoryStats(): {
  heapUsed: number;
  heapTotal: number;
  rss: number;
  external: number;
  heapUsedPercentage: number;
} {
  const mem = process.memoryUsage();
  return {
    heapUsed: mem.heapUsed,
    heapTotal: mem.heapTotal,
    rss: mem.rss,
    external: mem.external,
    heapUsedPercentage: (mem.heapUsed / mem.heapTotal) * 100,
  };
}

/**
 * CPU usage monitor
 */
export function getCPUStats(): {
  user: number;
  system: number;
} {
  const usage = process.cpuUsage();
  return {
    user: usage.user / 1000000, // Convert to seconds
    system: usage.system / 1000000,
  };
}

// Global performance trackers
export const queryTracker = new QueryPerformanceTracker();
export const cacheTracker = new CachePerformanceTracker();

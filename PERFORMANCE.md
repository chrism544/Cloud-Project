# Performance Optimization Guide

## Overview

This document provides guidelines and best practices for optimizing the performance of the Portal Management System.

## Database Optimization

### Query Optimization

1. **Use Indexes**
```prisma
// Already indexed fields in schema.prisma:
- User.email (unique index)
- Portal.subdomain (unique index)
- Page.slug (index with portalId)
- Menu.portalId (index)
```

2. **Avoid N+1 Queries**
```typescript
// Bad: N+1 query
const portals = await prisma.portal.findMany();
for (const portal of portals) {
  const pages = await prisma.page.findMany({ where: { portalId: portal.id } });
}

// Good: Use include
const portals = await prisma.portal.findMany({
  include: { pages: true }
});
```

3. **Select Only Required Fields**
```typescript
// Bad: Fetching all fields
const users = await prisma.user.findMany();

// Good: Select specific fields
const users = await prisma.user.findMany({
  select: { id: true, email: true, username: true }
});
```

4. **Use Pagination**
```typescript
// Implement cursor-based pagination for large datasets
const pages = await prisma.page.findMany({
  take: 20,
  skip: offset,
  orderBy: { createdAt: 'desc' }
});
```

5. **Optimize Joins**
```typescript
// Use select with relations to avoid over-fetching
const page = await prisma.page.findUnique({
  where: { id },
  select: {
    id: true,
    title: true,
    content: true,
    portal: {
      select: { id: true, name: true }
    }
  }
});
```

### Connection Pooling

Current Prisma connection pool settings (add to .env):
```env
# Adjust based on database capacity and load
DATABASE_CONNECTION_LIMIT=20
DATABASE_POOL_TIMEOUT=10
```

### Database Monitoring

Monitor these metrics:
- Query execution time
- Connection pool usage
- Slow query log
- Index usage statistics

```sql
-- Find slow queries (PostgreSQL)
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

## Caching Strategy

### Redis Caching

1. **Cache Published Pages**
```typescript
const cacheKey = `portal:${portalId}:page:${slug}`;
const cachedPage = await redis.get(cacheKey);

if (cachedPage) {
  cacheTracker.recordHit(Date.now() - startTime);
  return JSON.parse(cachedPage);
}

const page = await prisma.page.findFirst({ where: { portalId, slug } });
await redis.setex(cacheKey, 3600, JSON.stringify(page)); // 1 hour TTL
cacheTracker.recordMiss();
```

2. **Cache Menus**
```typescript
// Menu structure changes infrequently
const cacheKey = `portal:${portalId}:menu:${location}`;
await redis.setex(cacheKey, 86400, JSON.stringify(menu)); // 24 hours
```

3. **Cache Invalidation**
```typescript
// Invalidate on update
await prisma.page.update({ where: { id }, data: { title } });
await redis.del(`portal:${portalId}:page:${slug}`);
```

### Cache Warming

Pre-populate cache for frequently accessed data:
```typescript
// On application startup
async function warmCache() {
  const recentPages = await prisma.page.findMany({
    where: { isPublished: true },
    take: 100,
    orderBy: { createdAt: 'desc' }
  });

  for (const page of recentPages) {
    const key = `portal:${page.portalId}:page:${page.slug}`;
    await redis.setex(key, 3600, JSON.stringify(page));
  }
}
```

## API Performance

### Response Time Optimization

1. **Enable Compression**
```typescript
// Already enabled in server.ts via @fastify/compress
// Reduces payload size by 70-90%
```

2. **Implement Pagination**
```typescript
// All list endpoints should support pagination
app.get('/api/v1/pages', async (req, reply) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const [pages, total] = await Promise.all([
    prisma.page.findMany({ skip: offset, take: limit }),
    prisma.page.count()
  ]);

  return {
    data: pages,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) }
  };
});
```

3. **Use HTTP/2**
```typescript
// Enable in production with HTTPS
const app = Fastify({
  http2: true,
  https: {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  }
});
```

4. **Enable Keep-Alive**
```typescript
// Already enabled by default in Fastify
// Reduces connection overhead
```

### Rate Limiting

Prevent abuse while maintaining performance:
```typescript
// Global rate limit: 100 req/min
// Auth endpoints: 5 req/15min
// Adjust based on usage patterns
```

## Frontend Performance

### React Query Optimization

1. **Stale Time Configuration**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});
```

2. **Prefetching**
```typescript
// Prefetch on hover
<Link
  href="/dashboard/pages"
  onMouseEnter={() => queryClient.prefetchQuery(['pages'])}
>
  Pages
</Link>
```

3. **Optimistic Updates**
```typescript
// Already implemented in hooks
const updatePage = useUpdatePage(id);
updatePage.mutate(data, {
  onMutate: async (newData) => {
    // Optimistically update UI
    await queryClient.cancelQueries(['pages', id]);
    const previous = queryClient.getQueryData(['pages', id]);
    queryClient.setQueryData(['pages', id], newData);
    return { previous };
  },
});
```

### Next.js Optimization

1. **Image Optimization**
```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  width={500}
  height={300}
  alt="Description"
  priority // For above-the-fold images
/>
```

2. **Code Splitting**
```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false // Disable SSR for client-only components
});
```

3. **Font Optimization**
```typescript
// Use next/font for automatic font optimization
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

## Monitoring & Metrics

### Key Performance Indicators

Monitor these metrics:

1. **Response Times**
   - P50: < 100ms
   - P95: < 500ms
   - P99: < 1000ms

2. **Database Query Times**
   - Average: < 50ms
   - P95: < 200ms

3. **Cache Hit Rate**
   - Target: > 80%

4. **Error Rate**
   - Target: < 0.1%

5. **Throughput**
   - Requests per second capacity

### Performance Endpoints

Use the built-in performance endpoints:

```bash
# Get detailed system metrics
curl http://localhost:3000/api/v1/health/detailed

# Get Prometheus metrics
curl http://localhost:3000/api/v1/health/metrics
```

### Performance Testing

1. **Load Testing with Artillery**
```yaml
# artillery.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
scenarios:
  - name: 'Get pages'
    flow:
      - get:
          url: '/api/v1/pages'
```

Run: `artillery run artillery.yml`

2. **Benchmarking with autocannon**
```bash
npx autocannon -c 100 -d 30 http://localhost:3000/api/v1/health
```

## Resource Optimization

### Memory Management

1. **Monitor Memory Usage**
```typescript
// Available via health endpoint
const mem = process.memoryUsage();
if (mem.heapUsed / mem.heapTotal > 0.9) {
  logger.warn('High memory usage detected');
}
```

2. **Limit Response Sizes**
```typescript
// Implement pagination, don't return entire datasets
// Use streaming for large responses
```

3. **Clean Up Resources**
```typescript
// Close connections on shutdown
app.addHook('onClose', async () => {
  await prisma.$disconnect();
  redis.disconnect();
});
```

### CPU Optimization

1. **Use Worker Threads for Heavy Computations**
```typescript
import { Worker } from 'worker_threads';

function processHeavyTask(data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', { workerData: data });
    worker.on('message', resolve);
    worker.on('error', reject);
  });
}
```

2. **Avoid Blocking Operations**
```typescript
// Use async/await for I/O operations
// Offload CPU-intensive tasks to workers
// Use streams for large file processing
```

## Scalability

### Horizontal Scaling

1. **Stateless Application Design**
   - Store session data in Redis
   - Use load balancer (nginx, AWS ALB)
   - Share nothing between instances

2. **Database Read Replicas**
```typescript
// Configure Prisma with read replicas
const readReplica = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_READ_URL }
  }
});
```

3. **CDN for Static Assets**
   - Use CloudFront, Cloudflare, or Fastly
   - Cache images, CSS, JS files
   - Reduce origin server load

### Vertical Scaling

When to scale up:
- High CPU usage (> 80%)
- Memory pressure (> 90%)
- Database connection pool exhaustion
- Increased response times under load

## Performance Checklist

### Development
- [ ] Profile slow endpoints with `node --prof`
- [ ] Use Prisma query logs in development
- [ ] Implement request timing middleware
- [ ] Add database query performance tracking

### Pre-Production
- [ ] Run load tests
- [ ] Profile memory usage
- [ ] Optimize database indexes
- [ ] Configure connection pooling
- [ ] Enable caching
- [ ] Compress responses
- [ ] Minimize payload sizes

### Production
- [ ] Enable HTTP/2
- [ ] Use CDN for static assets
- [ ] Configure auto-scaling
- [ ] Set up performance monitoring
- [ ] Monitor cache hit rates
- [ ] Review slow query logs
- [ ] Optimize database queries
- [ ] Enable keep-alive connections

## Tools

### Recommended Performance Tools

- **Artillery** - Load testing
- **autocannon** - HTTP benchmarking
- **clinic.js** - Node.js performance profiling
- **Datadog APM** - Application performance monitoring
- **New Relic** - Full-stack observability
- **pgAdmin** - PostgreSQL query analysis
- **Redis Insight** - Redis monitoring

## Additional Resources

- [Fastify Performance Best Practices](https://www.fastify.io/docs/latest/Guides/Performance/)
- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

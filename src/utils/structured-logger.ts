import { FastifyRequest } from "fastify";

/**
 * Structured logging utilities for better log aggregation and analysis
 * Compatible with centralized logging services (CloudWatch, Datadog, etc.)
 */

export interface LogContext {
  userId?: string;
  portalId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  [key: string]: any;
}

/**
 * Extract logging context from Fastify request
 */
export function extractRequestContext(req: FastifyRequest): LogContext {
  return {
    requestId: req.id,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    method: req.method,
    url: req.url,
    userId: (req as any).user?.id,
    portalId: (req as any).user?.portalId,
  };
}

/**
 * Log business events with structured context
 */
export function logBusinessEvent(
  logger: any,
  eventType: string,
  context: LogContext,
  data?: Record<string, any>
) {
  logger.info({
    eventType,
    ...context,
    ...data,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log security events (auth failures, suspicious activity, etc.)
 */
export function logSecurityEvent(
  logger: any,
  eventType: string,
  context: LogContext,
  details?: Record<string, any>
) {
  logger.warn({
    category: 'security',
    eventType,
    ...context,
    ...details,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log performance metrics
 */
export function logPerformanceMetric(
  logger: any,
  operation: string,
  durationMs: number,
  context: LogContext
) {
  logger.info({
    category: 'performance',
    operation,
    durationMs,
    ...context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Log errors with stack traces and context
 */
export function logError(
  logger: any,
  error: Error,
  context: LogContext,
  additionalInfo?: Record<string, any>
) {
  logger.error({
    category: 'error',
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack,
    },
    ...context,
    ...additionalInfo,
    timestamp: new Date().toISOString(),
  });
}

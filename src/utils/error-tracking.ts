/**
 * Error tracking utilities
 * Designed to integrate with services like Sentry, Rollbar, or similar
 *
 * To enable error tracking:
 * 1. Install your preferred service SDK (e.g., npm install @sentry/node)
 * 2. Initialize it in this file
 * 3. Uncomment the integration code below
 */

export interface ErrorContext {
  userId?: string;
  portalId?: string;
  requestId?: string;
  url?: string;
  method?: string;
  userAgent?: string;
  [key: string]: any;
}

/**
 * Initialize error tracking service
 *
 * Example for Sentry:
 *
 * import * as Sentry from "@sentry/node";
 *
 * export function initErrorTracking() {
 *   if (process.env.SENTRY_DSN) {
 *     Sentry.init({
 *       dsn: process.env.SENTRY_DSN,
 *       environment: process.env.NODE_ENV || "development",
 *       tracesSampleRate: 1.0,
 *     });
 *   }
 * }
 */
export function initErrorTracking() {
  // Initialize your error tracking service here
  // Currently a no-op placeholder
}

/**
 * Capture exception with context
 *
 * Example for Sentry:
 *
 * export function captureException(error: Error, context?: ErrorContext) {
 *   if (process.env.SENTRY_DSN) {
 *     Sentry.captureException(error, {
 *       contexts: { custom: context || {} },
 *       user: context?.userId ? { id: context.userId } : undefined,
 *     });
 *   }
 *
 *   console.error('Error tracked:', error.message, context);
 * }
 */
export function captureException(error: Error, context?: ErrorContext) {
  // Capture exception in your error tracking service
  // Currently logs to console as fallback
  console.error('Exception:', {
    error: {
      message: error.message,
      name: error.name,
      stack: error.stack,
    },
    context,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Capture a message/warning
 *
 * Example for Sentry:
 *
 * export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: ErrorContext) {
 *   if (process.env.SENTRY_DSN) {
 *     Sentry.captureMessage(message, {
 *       level: level as any,
 *       contexts: { custom: context || {} },
 *     });
 *   }
 * }
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: ErrorContext
) {
  // Capture message in your error tracking service
  console.log(`[${level.toUpperCase()}]`, message, context);
}

/**
 * Set user context for error tracking
 *
 * Example for Sentry:
 *
 * export function setUserContext(userId: string, email?: string, username?: string) {
 *   if (process.env.SENTRY_DSN) {
 *     Sentry.setUser({ id: userId, email, username });
 *   }
 * }
 */
export function setUserContext(userId: string, email?: string, username?: string) {
  // Set user context in your error tracking service
  // Currently a no-op placeholder
}

/**
 * Clear user context (e.g., on logout)
 */
export function clearUserContext() {
  // Clear user context in your error tracking service
  // Currently a no-op placeholder
}

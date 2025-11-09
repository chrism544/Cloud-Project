import { FastifyReply } from "fastify";

/**
 * Enhanced security headers configuration
 * Implements OWASP security best practices
 */

export const SECURITY_HEADERS = {
  // Prevent clickjacking attacks
  "X-Frame-Options": "DENY",

  // Prevent MIME-sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable browser XSS protection
  "X-XSS-Protection": "1; mode=block",

  // Strict referrer policy
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Permissions policy (formerly Feature-Policy)
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",

  // Content Security Policy
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Consider removing unsafe-* in production
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),

  // Strict Transport Security (HSTS) - 1 year
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

/**
 * Apply security headers to response
 */
export function applySecurityHeaders(reply: FastifyReply): void {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    reply.header(key, value);
  });
}

/**
 * Remove sensitive headers from response
 */
export function removeSensitiveHeaders(reply: FastifyReply): void {
  reply.removeHeader("X-Powered-By");
  reply.removeHeader("Server");
}

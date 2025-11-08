import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: unknown;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR", details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed", details?: unknown) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found", details?: unknown) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", details?: unknown) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((err: any, _req: FastifyRequest, reply: FastifyReply) => {
    const isAppError = err instanceof AppError;

    const statusCode = isAppError ? err.statusCode : (err.statusCode ?? 500);
    const code = isAppError ? err.code : (err.code ?? "INTERNAL_ERROR");
    const message = isAppError ? err.message : (statusCode >= 500 ? "Internal server error" : err.message);

    if (statusCode >= 500) {
      app.log.error({ err }, "Unhandled error");
    } else {
      app.log.warn({ err }, "Handled error");
    }

    reply.status(statusCode).send({
      error: {
        code,
        message,
        details: isAppError ? err.details : undefined
      }
    });
  });
}

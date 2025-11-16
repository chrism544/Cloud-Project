class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export { AppError, ValidationError, NotFoundError, UnauthorizedError };
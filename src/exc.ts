export class AppError extends Error {
  public readonly status: number;
  constructor(m: string, status: number) {
    super(m);
    this.status = status;
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class SqlRetryableError extends AppError {
  constructor(m: string, status: number) {
    super(m, status);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SqlRetryableError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(m: string, status = 401) {
    super(m, status);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(m: string, status = 403) {
    super(m, status);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(m: string, status = 404) {
    super(m, status);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// throw this error when the request was performed with the right syntax and content
// but the operation cannot be performed.
export class CannotPerformOperationError extends AppError {
  constructor(m: string, status = 422) {
    super(m, status);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CannotPerformOperationError.prototype);
  }
}

export class ObjectValidationError extends AppError {
  constructor(m: string, status = 400) {
    super(m, status);
    Object.setPrototypeOf(this, ObjectValidationError.prototype);
  }
}
export class BadRequestError extends AppError {
  constructor(m = 'Bad request!', status = 400) {
    super(m, status);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

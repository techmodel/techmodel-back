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

import { AppError } from '../app/exc';

export class SqlRetryableError extends AppError {
  constructor(m: string, status: number) {
    super(m, status);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SqlRetryableError.prototype);
  }
}

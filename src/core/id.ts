import { v4 as uuid4 } from 'uuid';

export function ID(): string {
  return uuid4();
}

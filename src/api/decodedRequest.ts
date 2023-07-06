import { Request } from 'express';
import { UserDecoded } from '../app/user';

export interface DecodedRequest extends Request {
  userDecoded: UserDecoded;
}

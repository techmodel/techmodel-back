import { Request } from 'express';
import { userDecoded } from '../app/user';

export interface DecodedRequest extends Request {
  userDecoded: userDecoded;
}

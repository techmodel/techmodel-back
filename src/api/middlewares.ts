import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthorizationError } from '../exc';
import { JWT_SECRET } from '../config';
import { userDecoded } from '../models';

const tokenValidation = (token: string) => jwt.verify(token, JWT_SECRET) as userDecoded;

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  try {
    if (!token) {
      throw new AuthorizationError('No token found');
    }
    const decoded = tokenValidation(token);
    //TODO: think about what do do with decoded, like check type

    if (!decoded) {
      throw new AuthorizationError("Couldn't verify token");
    }
  } catch (err) {
    next(err);
  } finally {
    next();
  }
};

import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthorizationError } from '../exc';
import { JWT_SECRET } from '../config';
import { userDecoded, UserType } from '../models';

const tokenValidation = (token: string) => jwt.verify(token, JWT_SECRET) as userDecoded;

export const authMiddleware = (userType: UserType) => (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  try {
    if (!token) {
      throw new AuthorizationError('No token found');
    }

    const decoded = tokenValidation(token);

    if (!decoded) {
      throw new AuthorizationError("Couldn't verify token");
    }

    if (userType != decoded.userType) {
      throw new AuthorizationError('You are not authorized to perform this action');
    }
  } catch (err) {
    next(err);
  } finally {
    next();
  }
};

import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthenticationError, AuthorizationError } from '../exc';
import { JWT_SECRET } from '../config';
import { UserType } from '../models';
import { userDecoded } from '../app/user';
import { DecodedRequest } from './decodedRequest';

const tokenValidation = (token: string) => jwt.verify(token, JWT_SECRET) as userDecoded;

export const authMiddleware = (userTypes: UserType | UserType[]) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!Array.isArray(userTypes)) userTypes = [userTypes];
  const token = req.headers['authorization'];
  try {
    if (!token) {
      throw new AuthenticationError('No token found');
    }
    const decoded = tokenValidation(token);
    if (!decoded) {
      throw new AuthenticationError("Couldn't verify token");
    }
    if (!userTypes.includes(decoded.userType)) {
      throw new AuthorizationError('You are not authorized to perform this action');
    }
    (req as DecodedRequest).userDecoded = decoded;
  } catch (err) {
    next(err);
  } finally {
    next();
  }
};

import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError, AuthenticationError, AuthorizationError, SqlRetryableError } from '../exc';
import { JWT_SECRET } from '../config';
import { UserType } from '../models';
import { userDecoded } from '../app/user';
import { DecodedRequest } from './decodedRequest';
import logger from '../logger';

const tokenValidation = (token: string): userDecoded | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as userDecoded;
  } catch (e) {
    return null;
  }
};

export const authMiddleware = (userTypes: UserType | UserType[]) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!Array.isArray(userTypes)) userTypes = [userTypes];
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  try {
    if (!token) {
      throw new AuthenticationError('No token found');
    }
    const decoded = tokenValidation(token);
    if (!decoded) {
      throw new AuthenticationError('Couldnt verify token');
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

export const preLogApi = (req: Request, res: Response, next: NextFunction): void => {
  logger.info({
    message: 'request to backend',
    method: req.method,
    ip: req.ip,
    endpoint: req.originalUrl
  });
  next();
};

export const clientErrorHandler = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction): void => {
  // delegates the request to express's default error handler
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof AuthenticationError || err instanceof AuthorizationError) {
    res.status(err.status).send(err.message);
    logger.warn(err.message);
  } else if (err instanceof AppError) {
    res.status(err.status).send(err.message);
    logger.error(err.message);
  } else {
    res.status(500).json('Unknown Error');
    logger.error(err);
  }
};

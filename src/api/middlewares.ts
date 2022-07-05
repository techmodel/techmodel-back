import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AppError, AuthenticationError, AuthorizationError, SqlRetryableError } from '../exc';
import { JWT_SECRET } from '../config';
import { UserType } from '../models';
import { userDecoded } from '../app/user';
import { DecodedRequest } from './decodedRequest';
import logger from '../logger';

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

export const preLogApi = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method.padEnd(4)} | ${req.ip} | ${req.originalUrl}`, {
    method: req.method,
    ip: req.ip,
    endpoint: req.originalUrl
  });
  next();
};

export const clientErrorHandler = (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AuthenticationError) {
    res.status(401).json(err.message);
    logger.warn(err.message);
    // } else if (err instanceof DataOverridingError ||
    //     err instanceof errors.InvalidRequestQueryError ||
    //     err instanceof errors.ObjectValidationError ||
    //     err instanceof errors.ObjectNotFoundError) {
    //     res.status(400).json(err.message);
    //     logger.warn(err.message);
  } else if (err instanceof AuthorizationError) {
    res.status(403).json(err.message);
    logger.warn(err.message);
  } else if (err instanceof AppError || err instanceof SqlRetryableError) {
    res.status(500).json('Internal server error');
    logger.error(err);
  } else {
    res.status(500).json('Unknown Error');
    logger.error(err);
  }
};

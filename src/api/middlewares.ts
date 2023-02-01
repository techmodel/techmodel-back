import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { serializeError } from 'serialize-error';
import { userDecoded } from '../app/user';
import { JWT_SECRET, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, CLIENT_URL } from '../config';
import { AppError, AuthenticationError, AuthorizationError } from '../exc';
import logger from '../logger';
import { UserType } from '../models';
import { DecodedRequest } from './decodedRequest';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(AUTH_CLIENT_ID, AUTH_CLIENT_SECRET, CLIENT_URL);

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
    res.status(500).json('Internal server error, check backend logs');
    logger.error(serializeError(err));
  }
};

export const verifyGoogleAuthTokenLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authCode = req.cookies['user-auth'];
    if (!authCode) {
      throw new AuthenticationError('No auth cookie found');
    }
    const { tokens } = await client.getToken(authCode);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: AUTH_CLIENT_ID
    });
    const payload = ticket.getPayload()!;
    const userId = payload['sub'];
    const userImage = payload['picture'];
    req.cookies['userId'] = userId;
    req.cookies['userImage'] = userImage;
    req.cookies['userIdToken'] = tokens.id_token!;
  } catch (err) {
    next(err);
  } finally {
    next();
  }
};
export const verifyGoogleAuthTokenRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      throw new AuthenticationError('No id token found');
    }
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: AUTH_CLIENT_ID
    });
    const payload = ticket.getPayload()!;
    const userId = payload['sub'];
    const userImage = payload['picture'];
    const userEmail = payload['email'];
    req.cookies['userId'] = userId;
    req.cookies['userImage'] = userImage;
    req.cookies['userEmail'] = userEmail;
    req.cookies['userIdToken'] = idToken; // TODO: remove id token from cookies.
  } catch (err) {
    next(err);
  } finally {
    next();
  }
};

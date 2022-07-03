import { Router, Request, Response } from 'express';
import { login, register } from '../app/user';
import { AppError } from '../exc';
import { User } from '../models';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/login:
 *     post:
 *       operationId: login
 *       responses:
 *         '200':
 *           description: Log user in by userId, returns type loginResponse:
 *             application/json:'
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId as string;
    res.json(await login(userId));
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

/**
 * @openapi
 * paths:
 *   /api/v1/register:
 *     post:
 *       operationId: register
 *       responses:
 *         '200':
 *           description: inserts user to db and logs in by userId, returns type loginResponse:
 *             application/json:'
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const user = req.body.user as Partial<User>;
    res.json(await register(user));
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

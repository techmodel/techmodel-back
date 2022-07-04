import { Router, Request, Response, NextFunction } from 'express';
import { login, register } from '../app/user';
import { User } from '../models';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/users/login:
 *     post:
 *       operationId: login
 *       responses:
 *         '200':
 *           description: Log user in by userId, returns type loginResponse:
 *             application/json:'
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId as string;
    res.json(await login(userId));
  } catch (e) {
    next();
  }
});

/**
 * @openapi
 * paths:
 *   /api/v1/users/register:
 *     post:
 *       operationId: register
 *       responses:
 *         '200':
 *           description: inserts user to db and logs in by userId, returns type loginResponse:
 *             application/json:'
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body.user as Partial<User>;
    res.json(await register(user));
  } catch (e) {
    next();
  }
});

export default router;

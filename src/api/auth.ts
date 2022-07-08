import { Router, Request, Response, NextFunction } from 'express';
import { login, register } from '../app/user';
import { User } from '../models';

const router = Router();
// TODO: add swagger description of the inputs required
/**
 * @openapi
 * paths:
 *   /api/v1/auth/login:
 *     post:
 *       operationId: login
 *       responses:
 *         '200':
 *           description: Successfully logged in user
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.body.userId as string;
    res.json(await login(userId));
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * paths:
 *   /api/v1/auth/register:
 *     post:
 *       operationId: register
 *       responses:
 *         '200':
 *           description: inserts user to db and logs in by userId, returns type loginResponse
 *             application/json:'
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body.user as Partial<User>;
    res.json(await register(user));
  } catch (e) {
    next(e);
  }
});

export default router;

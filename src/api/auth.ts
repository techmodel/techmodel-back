import { Router, Request, Response, NextFunction } from 'express';
import { login, register } from '../app/user';
import { User } from '../models';
import { verifyGoogleAuthToken } from './middlewares';

const router = Router();
// TODO: add swagger description of the inputs required
/**
 * @openapi
 * paths:
 *   /api/v1/auth/login:
 *     get:
 *       operationId: login
 *       responses:
 *         '200':
 *           description: Successfully logged in user
 *     parameters:
 *       - in: body
 *         name: userId
 *         schema:
 *           type: string
 *           description: User ID of the user that is trying to log in
 *           required: true
 */
router.get('/login', verifyGoogleAuthToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.cookies.userId;
    const loginResponse = await login(userId);
    const returnToUrl = loginResponse.isFound ? req.cookies['return-to-login'] : req.cookies['return-to-register'];
    res.cookie('userToken', loginResponse);
    res.redirect(returnToUrl);
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
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 *       parameters:
 *         - in: body
 *           name: user
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/createUserInfoPayload'
 *           required: true
 *           description: new user creation payload
 */
router.post('/register', verifyGoogleAuthToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body.user as Partial<User>;
    res.json(await register(user));
  } catch (e) {
    next(e);
  }
});

export default router;

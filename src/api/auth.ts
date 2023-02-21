import { Router, Request, Response, NextFunction } from 'express';
import { login, register } from '../app/user';
import { User } from '../models';
import { verifyGoogleAuthTokenLogin, verifyGoogleAuthTokenRegister } from './middlewares';
import { BACKEND_DOMAIN } from '../config';

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
router.get('/login', verifyGoogleAuthTokenLogin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, userImage, userIdToken } = req.cookies;
    const loginResponse = await login(userId, userImage, userIdToken);
    const returnToUrl = loginResponse.isFound ? req.cookies['return-to-login'] : req.cookies['return-to-register'];
    res.cookie('user-data', loginResponse, { maxAge: 2 * 60 * 60 * 1000 });
    res.redirect(returnToUrl);
  } catch (e) {
    next(e);
  }
});

router.get('/loginjwt', verifyGoogleAuthTokenLogin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, userImage, userIdToken } = req.cookies;
    const loginResponse = await login(userId, userImage, userIdToken);
    res.json(loginResponse);
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * paths:
 *   /api/v1/auth/logout:
 *     get:
 *       operationId: logout
 *       responses:
 *         '200':
 *           description: Successfully logged out user
 */
router.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('user-data');
    res.send('test');
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
router.post('/register', verifyGoogleAuthTokenRegister, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userToCreate = req.body.user as Partial<User>;
    const { userId, userImage, userIdToken, userEmail } = req.cookies;
    const user = { id: userId, email: userEmail, ...userToCreate };
    const loginResponse = await register(user, userImage, userIdToken);
    res.json(loginResponse);
  } catch (e) {
    next(e);
  }
});

export default router;

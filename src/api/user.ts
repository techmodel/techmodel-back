import { NextFunction, Request, Response, Router } from 'express';
import { updateUserInfo } from '../app/user';
import { getVolunteerRequestsByUser } from '../app/volunteerRequest';
import { AuthorizationError } from '../exc';
import { UserType } from '../models';
import { DecodedRequest } from './decodedRequest';
import { authMiddleware } from './middlewares';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/user/{userId}/volunteer-requests:
 *     get:
 *       summary: Returns list of volunteer requests the user is assigned to
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Respresentation of volunteer requests
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/volunteerRequest'
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *       parameters:
 *         - in: path
 *           name: userId
 *           schema:
 *             type: text
 *           required: true
 *           description: user id
 */
router.get(
  '/:userId/volunteer-requests',
  authMiddleware(UserType.VOLUNTEER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      if (userId != (req as DecodedRequest).userDecoded.userId) {
        throw new AuthorizationError('Trying to access different user info');
      }
      res.send(getVolunteerRequestsByUser(userId));
    } catch (e) {
      next(e);
    }
  }
);

router.put(
  '/update-info',
  authMiddleware([...Object.values(UserType)]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId: id, userType } = (req as DecodedRequest).userDecoded;
      const { userInfo } = req.body;
      userInfo['userType'] = userType;
      await updateUserInfo({ id, ...userInfo });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

export default router;

import { NextFunction, Request, Response, Router } from 'express';
import { mapVolunteerRequestToReturnVolunteerRequestDTO } from '../app/dto/volunteerRequest';
import { removePersonalInfo, updateUserInfo, updateUserInstitutionId } from '../app/user';
import { getVolunteerRequestsByUser } from '../app/volunteerRequest';
import { AuthorizationError, CannotPerformOperationError } from '../exc';
import { UserType } from '../models';
import { DecodedRequest } from './decodedRequest';
import { authMiddleware } from './middlewares';
import { BACKEND_DOMAIN } from '../config';

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
      const domainVrs = await getVolunteerRequestsByUser(userId);
      res.send(domainVrs.map(vr => mapVolunteerRequestToReturnVolunteerRequestDTO(vr)));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/user/{userId}:
 *     put:
 *       summary: Updates user info
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Updated user info
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 *       parameters:
 *         - in: body
 *           name: userInfo
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/updateUserInfoPayload'
 *           required: true
 *           description: update payload
 *         - in: path
 *           name: id
 *           schema:
 *             type: number
 *           required: true
 *           description: user id
 */
router.put(
  '/:userId',
  authMiddleware([...Object.values(UserType)]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.userId;
      const userDecoded = (req as DecodedRequest).userDecoded;
      if (userId != userDecoded.userId) {
        throw new AuthorizationError('Trying to access different user info');
      }
      const { userInfo } = req.body;
      await updateUserInfo(userId, { ...userInfo, userType: userDecoded.userType });
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/user/{userId}/institution:
 *     put:
 *       summary: Updates coordinator's institution
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Updated coordinator's institution
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 *       parameters:
 *         - in: body
 *           name: newInstitutionId
 *           schema:
 *             type: object
 *             properties:
 *               newInstitutionId:
 *                 type: number
 *           required: true
 *           description: the institution id the user will be changed to
 *         - in: path
 *           name: id
 *           schema:
 *             type: number
 *           required: true
 *           description: user id
 */
router.put(
  '/:userId/institution',
  authMiddleware(UserType.PROGRAM_MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetUserId = req.params.userId;
      const userDecoded = (req as DecodedRequest).userDecoded;
      const { newInstitutionId } = req.body;
      await updateUserInstitutionId(userDecoded, targetUserId, newInstitutionId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/user:
 *     delete:
 *       summary: Deletes the user performing the request
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: User has been deleted
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 */
router.delete(
  '/',
  authMiddleware([...Object.values(UserType)]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDecoded = (req as DecodedRequest).userDecoded;
      if (userDecoded.userType == UserType.PROGRAM_MANAGER) {
        throw new CannotPerformOperationError(
          'You are a program manger, please contact site administrators to delete your user'
        );
      }
      await removePersonalInfo(userDecoded);
      res.clearCookie('user-data', { path: '/', domain: BACKEND_DOMAIN });
      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
);

export default router;

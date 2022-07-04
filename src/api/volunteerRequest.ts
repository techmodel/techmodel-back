import { Router, Request, Response, NextFunction } from 'express';
import {
  assignVolunteerToRequest,
  getRelevantAndOpenVolunteerRequests,
  getVolunteeRequestsByUser
} from '../app/volunteerRequest';
import { AuthorizationError } from '../exc';
import { UserType } from '../models';
import { DecodedRequest } from './decodedRequest';
import { authMiddleware } from './middlewares';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/volunteer-requests:
 *     get:
 *       operationId: getObject
 *       responses:
 *         '200':
 *           description: Respresentation of volunteer requests
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/volunteerRequest'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getRelevantAndOpenVolunteerRequests());
  } catch (e) {
    next();
  }
});

/**
 * @openapi
 * paths:
 *   /api/v1/volunteer-requests/{requestId}/volunteers:
 *     post:
 *       summary: Assigns the volunteer that makes the request to the target volunteer request
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Volunteer has been assigned
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *       parameters:
 *         - in: path
 *           name: requestId
 *           schema:
 *             type: number
 *           required: true
 *           description: volunteer request id the mapping of the volunteer is done to
 */
router.post(
  '/:requestId/volunteers',
  authMiddleware(UserType.VOLUNTEER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = parseInt(req.params.requestId, 10);
      await assignVolunteerToRequest((req as DecodedRequest).userDecoded.userId, requestId);
      res.sendStatus(200);
    } catch (e) {
      next();
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/volunteer-requests/{userId}:
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
router.get('/:userId', authMiddleware(UserType.VOLUNTEER), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId;
    if (userId != (req as DecodedRequest).userDecoded.userId) {
      throw new AuthorizationError('Trying to access different user info');
    }
    await getVolunteeRequestsByUser(userId);
    res.sendStatus(200);
  } catch (e) {
    next;
  }
});

export default router;

import { NextFunction, Request, Response, Router } from 'express';
import {
  assignVolunteerToRequest,
  deleteVolunteerFromRequest,
  getRelevantAndOpenVolunteerRequests
} from '../app/volunteerRequest';
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
    next(e);
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
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/volunteer-requests/{requestId}/volunteers/{volunteerId}:
 *     delete:
 *       summary: Deletes the mapping of the volunteer to the target volunteer request
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Volunteer has been deleted
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 *       parameters:
 *         - in: path
 *           name: requestId
 *           schema:
 *           type: number
 *           required: true
 *           description: volunteer request id the mapping of the volunteer is done to
 *         - in: path
 *           name: volunteerId
 *           schema:
 *           type: string
 *           required: true
 *           description: volunteer id the mapping of the volunteer is done to
 */
router.delete(
  '/:requestId/volunteers/:volunteerId',
  authMiddleware([UserType.VOLUNTEER, UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = parseInt(req.params.requestId, 10);
      const volunteerId = req.params.volunteerId;
      await deleteVolunteerFromRequest((req as DecodedRequest).userDecoded, volunteerId, requestId);
      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
);

export default router;

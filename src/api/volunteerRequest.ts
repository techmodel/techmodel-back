import { NextFunction, Request, Response, Router } from 'express';
import {
  assignVolunteerToRequest,
  createVolunteerRequest,
  deleteVolunteerFromRequest,
  getRelevantAndOpenVolunteerRequests,
  setVolunteerRequestAsDeleted,
  updateVolunteerRequest
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
router.get('/', authMiddleware(UserType.VOLUNTEER), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as DecodedRequest).userDecoded;
    res.json(await getRelevantAndOpenVolunteerRequests(userId));
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * paths:
 *   /api/v1/volunteer-requests:
 *     post:
 *       summary: Create a new volunteer request
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Created volunteer request
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 *       parameters:
 *         - in: body
 *           name: volunteerRequest
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/createVolunteerRequestPayload'
 *           required: true
 *           description: information about the volunteer request
 */
router.post(
  '/',
  authMiddleware([UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const volunteerRequest = req.body;
      const { userDecoded } = req as DecodedRequest;
      res.json(await createVolunteerRequest(volunteerRequest, userDecoded));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/volunteer-requests/{id}:
 *     put:
 *       summary: Update volunteer request
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Updated volunteer request
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 *       parameters:
 *         - in: body
 *           name: volunteerRequest
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/updateVolunteerRequestPayload'
 *           required: true
 *           description: information about the volunteer request
 *         - in: path
 *           name: id
 *           schema:
 *             type: number
 *           required: true
 *           description: volunteer request id the mapping of the volunteer is done to
 */
router.put(
  '/:id',
  authMiddleware([UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const volunteerRequestInfo = req.body;
      const id = +req.params.id;
      const { userDecoded } = req as DecodedRequest;
      await updateVolunteerRequest(id, volunteerRequestInfo, userDecoded);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
);

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
 *         '404':
 *           $ref: '#/components/responses/NotFoundError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
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
 *   /api/v1/volunteer-requests/{requestId}:
 *     delete:
 *       summary: Sets the volunteer request as deleted
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Volunteer request has been deleted
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
 */
router.delete(
  '/:requestId',
  authMiddleware([UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = parseInt(req.params.requestId, 10);
      await setVolunteerRequestAsDeleted((req as DecodedRequest).userDecoded, requestId);
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

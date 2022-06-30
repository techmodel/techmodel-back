import { Router, Request, Response } from 'express';
import { assignVolunteerToRequest, getRelevantAndOpenVolunteerRequests } from '../app/volunteerRequest';
import { AppError } from '../exc';
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
router.get('/volunteer-requests', async (req: Request, res: Response) => {
  try {
    res.json(await getRelevantAndOpenVolunteerRequests());
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
router.post('/volunteer-requests/:requestId/volunteers', authMiddleware([]), async (req: Request, res: Response) => {
  try {
    const requestId = parseInt(req.params.requestId, 10);
    await assignVolunteerToRequest((req as DecodedRequest).userDecoded.userId, requestId);
    res.sendStatus(200);
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

export default router;

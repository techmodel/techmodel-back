import { Router, Request, Response, NextFunction } from 'express';
import { UserType } from '../models';
import { createFeedback } from '../app/feedback';
import { feedbackRepository } from '../repos';
import { authMiddleware } from './middlewares';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/feedback/{volunteerRequestId}/{userId}:
 *     get:
 *       operationId: getFeedbackByUserAndVolunteerRequestId
 *       responses:
 *         '200':
 *           description: Feedback lists per user for a specific volunteer Request
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/location'
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: user id
 *         - in: path
 *           name: volunteerRequestId
 *           required: true
 *           description: volunteer request id
 *
 * components:
 *   schemas:
 *     location:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         createdAt:
 *           type: date
 *         review:
 *           type: number
 *         notes:
 *           type: string
 */
router.get(
  '/:volunteerRequestId/:userId',
  authMiddleware([...Object.values(UserType)]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, volunteerRequestId } = req.params;
      res.json(await feedbackRepository.getFeedback(+volunteerRequestId, userId));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/feedback/{volunteerRequestId}:
 *     get:
 *       operationId: getFeedbackByVolunteerRequestId
 *       responses:
 *         '200':
 *           description: Feedback lists per user for a specific volunteer Request
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/location'
 *       parameters:
 *         - in: path
 *           name: volunteerRequestId
 *           required: true
 *           description: volunteer request id
 *
 * components:
 *   schemas:
 *     location:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         createdAt:
 *           type: date
 *         review:
 *           type: number
 *         notes:
 *           type: string
 */
router.get(
  '/:volunteerRequestId',
  authMiddleware([UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { volunteerRequestId } = req.params;
      res.json(await feedbackRepository.getFeedback(+volunteerRequestId));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/feedback:
 *     post:
 *       summary: Create a new feedback
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Created feedback
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 *       parameters:
 *         - in: body
 *           name: feedback
 *           required: true
 *           description: information about the feedback request
 */
router.post('/', authMiddleware([UserType.VOLUNTEER]), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const feedbackRequest = req.body;
    res.json(await createFeedback(feedbackRequest));
  } catch (e) {
    next(e);
  }
});

export default router;

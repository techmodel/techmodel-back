import { Router, Request, Response } from 'express';
import { getRelevantAndOpenVolunteerRequests } from '../app/volunteerRequest';
import { AppError } from '../exc';

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
 * components:
 *   schemas:
 *     volunteerRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         name:
 *           type: string
 *         audience:
 *           type: number
 *         isPhysical:
 *           type: boolean
 *         description:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         duration:
 *           type: string
 *         startTime:
 *           type: string
 *           format: date-time
 *         totalVolunteers:
 *           type: number
 *         currentVolunteers:
 *           type: number
 *         status:
 *           type: string
 *         creatorId:
 *           type: string
 *         language:
 *           type: string
 *         skillToVolunteerRequest:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/skillToVolunteerRequest'
 *     skillToVolunteerRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *           description: can be ignored, no real use for this id
 *         skillId:
 *           type: number
 *           description: can be ignored, use the id from the `skill` object
 *         volunteerRequestId:
 *           type: number
 *           description: can be ignored, use the id from the `volunteerRequest` object
 *         skill:
 *           $ref: '#/components/schemas/skill'
 *     skill:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         type:
 *           type: string
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

export default router;

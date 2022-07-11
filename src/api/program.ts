import { Router, Request, Response, NextFunction } from 'express';
import { getPrograms } from '../app/program';
import { getVolunteerRequestsOfProgram } from '../app/volunteerRequest';
import { AuthorizationError } from '../exc';
import { UserType } from '../models';
import { DecodedRequest } from './decodedRequest';
import { authMiddleware } from './middlewares';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/programs:
 *     get:
 *       operationId: getObject
 *       responses:
 *         '200':
 *           description: Respresentation of programs
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/program'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getPrograms());
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * paths:
 *   /api/v1/program/volunteer-requests:
 *    get:
 *     operationId: getObject
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Respresentation of volunteer requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/volunteerRequest'
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           required: false
 */
router.get(
  '/volunteer-requests',
  authMiddleware([UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId, institutionId } = (req as DecodedRequest).userDecoded;
      const startDate = req.query.startDate as string;
      if (!programId) throw new AuthorizationError('No program found');
      res.json(await getVolunteerRequestsOfProgram(programId, institutionId, startDate));
    } catch (e) {
      next(e);
    }
  }
);

export default router;

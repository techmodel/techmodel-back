import { Router, Request, Response, NextFunction } from 'express';
import { getCoordinators, getPrograms } from '../app/program';
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
 *   /api/v1/programs/{programId}/volunteer-requests:
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
 *       - in: path
 *         name: programId
 *         schema:
 *         type: number
 *         required: true
 *         description: program id
 */
router.get(
  '/:programId/volunteer-requests',
  authMiddleware([UserType.PROGRAM_COORDINATOR, UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: userProgramId, institutionId } = (req as DecodedRequest).userDecoded;
      const startDate = req.query.startDate as string | undefined;
      if (!userProgramId) throw new AuthorizationError('No program found');
      const pathProgramId = parseInt(req.params.programId, 10);
      if (pathProgramId != userProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      res.json(await getVolunteerRequestsOfProgram(userProgramId, institutionId, startDate));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/programs/{programId}/coordinators:
 *    get:
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns coordinators of the program
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
 *     parameters:
 *       - in: path
 *         name: programId
 *         schema:
 *         type: number
 *         required: true
 *         description: program id
 */
router.get(
  '/:programId/coordinators',
  authMiddleware(UserType.PROGRAM_MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: userProgramId } = (req as DecodedRequest).userDecoded;
      if (!userProgramId) throw new AuthorizationError('No program found');
      const pathProgramId = parseInt(req.params.programId, 10);
      if (pathProgramId != userProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      res.json(await getCoordinators(userProgramId));
    } catch (e) {
      next(e);
    }
  }
);

export default router;

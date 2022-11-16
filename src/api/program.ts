import { Router, Request, Response, NextFunction } from 'express';
import {
  acceptPendingCoordinator,
  denyPendingCoordinator,
  getCoordinators,
  getPendingCoordinators,
  getPrograms
} from '../app/program';
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
 *                 $ref: '#/components/schemas/programVolunteerRequest'
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
      const { programId: callerProgramId } = (req as DecodedRequest).userDecoded;
      if (!callerProgramId) throw new AuthorizationError('No program found');
      const pathProgramId = parseInt(req.params.programId, 10);
      if (pathProgramId != callerProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      res.json(await getCoordinators(callerProgramId));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/programs/{programId}/pending-coordinators:
 *    get:
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns pending users to become coordinators of the program
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
  '/:programId/pending-coordinators',
  authMiddleware(UserType.PROGRAM_MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: callerProgramId } = (req as DecodedRequest).userDecoded;
      const pathProgramId = parseInt(req.params.programId, 10);
      if (pathProgramId != callerProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      res.json(await getPendingCoordinators(callerProgramId));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/programs/{programId}/pending-coordinators/{pendingUserId}/accept:
 *    post:
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: accept pending user to become a coordinator of the program
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
 *       - in: path
 *         name: pendingUserId
 *         schema:
 *         type: number
 *         required: true
 *         description: id of the pending user
 */
router.post(
  '/:programId/pending-coordinators/:pendingUserId/accept',
  authMiddleware(UserType.PROGRAM_MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: callerProgramId } = (req as DecodedRequest).userDecoded;
      const pathProgramId = parseInt(req.params.programId, 10);
      const pendingUserId = req.params.pendingUserId;
      if (pathProgramId != callerProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      res.json(await acceptPendingCoordinator(callerProgramId, pendingUserId));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/programs/{programId}/pending-coordinators/{pendingUserId}:
 *    delete:
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: deny pending user to become a coordinator of the program
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
 *       - in: path
 *         name: pendingUserId
 *         schema:
 *         type: number
 *         required: true
 *         description: id of the pending user
 */
router.delete(
  '/:programId/pending-coordinators/:pendingUserId',
  authMiddleware(UserType.PROGRAM_MANAGER),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: callerProgramId } = (req as DecodedRequest).userDecoded;
      const pathProgramId = parseInt(req.params.programId, 10);
      const pendingUserId = req.params.pendingUserId;
      if (pathProgramId != callerProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      res.json(await denyPendingCoordinator(callerProgramId, pendingUserId));
    } catch (e) {
      next(e);
    }
  }
);

export default router;

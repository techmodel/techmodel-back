import { Router, Request, Response, NextFunction } from 'express';
import {
  acceptPendingCoordinator,
  addInstitutionToProgram,
  deleteInstitutionToProgram,
  denyPendingCoordinator,
  getCoordinators,
  getPendingCoordinators,
  getProgramStats,
  getPrograms,
  programRelatedInstitutions
} from '../app/program';
import { getVolunteerRequestsOfProgram } from '../app/volunteerRequest';
import { AuthorizationError, BadRequestError } from '../exc';
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

/**
 * @openapi
 * paths:
 *   /api/v1/programs/{programId}/institutions:
 *    get:
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: returns list of institution ids related to the program
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: number
 *     parameters:
 *       - in: path
 *         name: programId
 *         schema:
 *         type: number
 *         required: true
 *         description: program id
 */
router.get(
  '/:programId/institutions',
  authMiddleware([UserType.PROGRAM_MANAGER, UserType.PROGRAM_COORDINATOR]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: callerProgramId } = (req as DecodedRequest).userDecoded;
      const pathProgramId = parseInt(req.params.programId, 10);
      if (pathProgramId != callerProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      res.json(await programRelatedInstitutions(callerProgramId));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/programs/{programId}/institutions:
 *    post:
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: maps institution to a program
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: number
 *     parameters:
 *       - in: path
 *         name: programId
 *         schema:
 *         type: number
 *         required: true
 *         description: program id
 *       - in: body
 *         name: institutionId
 *         schema:
 *           type: number
 *         required: true
 *         description: id of the institution
 */
router.post(
  '/:programId/institutions',
  authMiddleware([UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: callerProgramId } = (req as DecodedRequest).userDecoded;
      const pathProgramId = parseInt(req.params.programId, 10);
      if (pathProgramId != callerProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      const { institutionId } = req.body;
      res.json(await addInstitutionToProgram(callerProgramId, institutionId));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/programs/{programId}/institutions/{institutionId}:
 *    delete:
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: returns list of institution ids related to the program
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: number
 *     parameters:
 *       - in: path
 *         name: programId
 *         schema:
 *         type: number
 *         required: true
 *         description: program id
 *       - in: path
 *         name: institutionId
 *         schema:
 *         type: number
 *         required: true
 *         description: institution id to delete
 */
router.delete(
  '/:programId/institutions/:institutionId',
  authMiddleware([UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: callerProgramId } = (req as DecodedRequest).userDecoded;
      const pathProgramId = parseInt(req.params.programId, 10);
      const institutionId = parseInt(req.params.institutionId, 10);
      if (pathProgramId != callerProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      if (!institutionId) {
        throw new BadRequestError('institution id is missing');
      }
      res.json(await deleteInstitutionToProgram(callerProgramId, institutionId));
    } catch (e) {
      next(e);
    }
  }
);

/**
 * @openapi
 * paths:
 *   /api/v1/programs/{programId}/stats:
 *    get:
 *     operationId: getObject
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Statistics about the program so far
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 relatedInstitutions:
 *                   type: number
 *                 coordinators:
 *                   type: number
 *                 vrOpen:
 *                   type: number
 *                 vrClosed:
 *                   type: number
 *                 volunteers:
 *                   type: number
 *     parameters:
 *       - in: path
 *         name: programId
 *         schema:
 *         type: number
 *         required: true
 *         description: program id
 */
router.get(
  '/:programId/stats',
  authMiddleware([UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId: userProgramId } = (req as DecodedRequest).userDecoded;
      if (!userProgramId) throw new AuthorizationError('No program found');
      const pathProgramId = parseInt(req.params.programId, 10);
      if (pathProgramId != userProgramId) {
        throw new AuthorizationError('Trying to access another program data');
      }
      res.json(await getProgramStats(pathProgramId));
    } catch (e) {
      next(e);
    }
  }
);

export default router;

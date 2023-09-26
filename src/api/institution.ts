import { Router, Request, Response, NextFunction } from 'express';
import { createInstitution, getInstitutions } from '../app/institution';
import { UserType } from '../models';
import { authMiddleware } from './middlewares';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/institutions:
 *     get:
 *       operationId: getInstitutions
 *       responses:
 *         '200':
 *           description: Respresentation of institutions
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/institution'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getInstitutions());
  } catch (e) {
    next(e);
  }
});

/**
 * @openapi
 * paths:
 *   /api/v1/institutions:
 *     post:
 *       summary: Create a new institution
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         '200':
 *           description: Created institution
 *         '401':
 *           $ref: '#/components/responses/UnauthorizedError'
 *         '422':
 *           $ref: '#/components/responses/OperationNotAllowedError'
 *       parameters:
 *         - in: body
 *           name: institution
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/createInstitutionPayload'
 *           required: true
 *           description: information about the institution
 */
router.post(
  '/',
  authMiddleware([UserType.PROGRAM_MANAGER]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const institution = req.body;
      res.json(await createInstitution(institution));
    } catch (e) {
      next(e);
    }
  }
);

export default router;

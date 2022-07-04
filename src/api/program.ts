import { Router, Request, Response, NextFunction } from 'express';
import { getPrograms } from '../app/program';

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
    next();
  }
});

export default router;

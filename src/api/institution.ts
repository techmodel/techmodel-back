import { Router, Request, Response, NextFunction } from 'express';
import { getInstitutions } from '../app/institution';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/institutions:
 *     get:
 *       operationId: getObject
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
    next();
  }
});

export default router;

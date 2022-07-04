import { NextFunction, Request, Response, Router } from 'express';
import { getCities } from '../app/city';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/cities:
 *     get:
 *       operationId: getObject
 *       responses:
 *         '200':
 *           description: Respresentation of cities
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/city'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getCities());
  } catch (e) {
    next(e);
  }
});

export default router;

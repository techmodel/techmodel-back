import { Router, Request, Response, NextFunction } from 'express';
import { getLocations } from '../app/location';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/locations:
 *     get:
 *       operationId: getLocation
 *       responses:
 *         '200':
 *           description: Respresentation of locations
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/location'
 * components:
 *   schemas:
 *     location:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getLocations());
  } catch (e) {
    next(e);
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { getLocations } from '../app/location';
import { AppError } from '../exc';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/locations:
 *     get:
 *       operationId: getObject
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
router.get('/locations', async (req: Request, res: Response) => {
  try {
    res.json(await getLocations());
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

export default router;

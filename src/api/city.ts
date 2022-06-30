import { Router, Request, Response } from 'express';
import { getCities } from '../app/city';
import { AppError } from '../exc';

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
 * components:
 *   schemas:
 *     city:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 */
router.get('/cities', async (req: Request, res: Response) => {
  try {
    res.json(await getCities());
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

export default router;

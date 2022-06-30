import { Router, Request, Response } from 'express';
import { getInstitutions } from '../app/institution';
import { AppError } from '../exc';

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
 * components:
 *   schemas:
 *     institution:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         name:
 *           type: string
 *         address:
 *           type: string
 *         locationId:
 *           type: number
 *         cityId:
 *           type: number
 *         location:
 *           $ref: '#/components/schemas/location'
 *         city:
 *           $ref: '#/components/schemas/city'
 *         populationType:
 *           type: string
 *         institutionType:
 *           type: string
 */
router.get('/institutions', async (req: Request, res: Response) => {
  try {
    res.json(await getInstitutions());
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

export default router;

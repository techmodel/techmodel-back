import { Router, Request, Response } from 'express';
import { getCompanies } from '../app/company';
import { AppError } from '../exc';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/companies:
 *     get:
 *       operationId: getObject
 *       responses:
 *         '200':
 *           description: Respresentation of companies
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/company'
 */
router.get('/companies', async (req: Request, res: Response) => {
  try {
    res.json(await getCompanies());
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

export default router;

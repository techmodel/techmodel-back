import { Router, Request, Response, NextFunction } from 'express';
import { getCompanies } from '../app/company';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/companies:
 *     get:
 *       operationId: getCompanies
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
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getCompanies());
  } catch (e) {
    next(e);
  }
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { getSkills } from '../app/skill';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/skills:
 *     get:
 *       operationId: getObject
 *       responses:
 *         '200':
 *           description: Respresentation of skills
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/skill'
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json(await getSkills());
  } catch (e) {
    next(e);
  }
});

export default router;

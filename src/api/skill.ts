import { Router, Request, Response } from 'express';
import { getSkills } from '../app/skill';
import { AppError } from '../exc';

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
router.get('/skills', async (req: Request, res: Response) => {
  try {
    res.json(await getSkills());
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

export default router;

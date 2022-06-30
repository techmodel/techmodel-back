import { Router, Request, Response } from 'express';
import { getPrograms } from '../app/program';
import { AppError } from '../exc';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/programs:
 *     get:
 *       operationId: getObject
 *       responses:
 *         '200':
 *           description: Respresentation of programs
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/program'
 * components:
 *   schemas:
 *     program:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 */
router.get('/programs', async (req: Request, res: Response) => {
  try {
    res.json(await getPrograms());
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

export default router;

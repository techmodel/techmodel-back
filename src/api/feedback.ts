import { Router, Request, Response, NextFunction } from 'express';
import { getFeedback } from '../app/feedback';

const router = Router();

/**
 * @openapi
 * paths:
 *   /api/v1/feedback:
 *     get:
 *       operationId: getObject
 *       responses:
 *         '200':
 *           description: Feedback lists
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
    res.json(await getFeedback());
  } catch (e) {
    next(e);
  }
});

export default router;

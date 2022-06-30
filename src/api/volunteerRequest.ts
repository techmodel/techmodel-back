import { Router, Request, Response } from 'express';
import { allRelevantAndOpenVolunteerRequests } from '../app/volunteerRequest';
import { AppError } from '../exc';

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: filter volunteer requests
 *     responses:
 *       200:
 *         description: Returns relevant non full volunteer requests.
 */
router.get('/volunteer-request', async (req: Request, res: Response) => {
  try {
    res.json(allRelevantAndOpenVolunteerRequests());
  } catch (e) {
    if (e instanceof AppError) {
      res.status(e.status).send(e);
    } else {
      res.status(500).send(e);
    }
  }
});

export default router;

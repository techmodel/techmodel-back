import volunteerRequestRouter from './volunteerRequest';
import companyRouter from './company';
import skillRouter from './skill';
import programRouter from './program';
import institutionRouter from './institution';
import cityRouter from './city';
import locationRouter from './location';
import userRouter from './user';
import { Router } from 'express';
import { clientErrorHandler, preLogApi } from './middlewares';

const router = Router();
router.use(preLogApi);

router.use('volunteer-requests', volunteerRequestRouter);
router.use('companies', companyRouter);
router.use('institutions', institutionRouter);
router.use('locations', locationRouter);
router.use('programs', programRouter);
router.use('cities', cityRouter);
router.use('skills', skillRouter);
router.use('users', userRouter);

router.use(clientErrorHandler);

export default router;

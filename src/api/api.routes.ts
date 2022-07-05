import volunteerRequestRouter from './volunteerRequest';
import companyRouter from './company';
import skillRouter from './skill';
import programRouter from './program';
import institutionRouter from './institution';
import cityRouter from './city';
import locationRouter from './location';
import authRouter from './auth';
import userRouter from './user';
import { Router } from 'express';
import { clientErrorHandler, preLogApi } from './middlewares';

const router = Router();
router.use(preLogApi);

router.use('/volunteer-requests', volunteerRequestRouter);
router.use('/companies', companyRouter);
router.use('/skills', skillRouter);
router.use('/programs', programRouter);
router.use('/institutions', institutionRouter);
router.use('/cities', cityRouter);
router.use('/locations', locationRouter);
router.use('/auth', authRouter);
router.use('/user', userRouter);

router.use(clientErrorHandler);

export default router;

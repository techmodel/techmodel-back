import express from 'express';
import bodyParser from 'body-parser';
import swaggerui from '../swaggerRouter';
import volunteerRequestRouter from '../api/volunteerRequest';
import companyRouter from '../api/company';
import skillRouter from '../api/skill';
import programRouter from '../api/program';
import institutionRouter from '../api/institution';
import cityRouter from '../api/city';
import locationRouter from '../api/location';
import { API_PREFIX } from '../config';

const app = express();

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(API_PREFIX, volunteerRequestRouter);
app.use(API_PREFIX, companyRouter);
app.use(API_PREFIX, skillRouter);
app.use(API_PREFIX, programRouter);
app.use(API_PREFIX, institutionRouter);
app.use(API_PREFIX, cityRouter);
app.use(API_PREFIX, locationRouter);

app.get('/', (req, res) => res.redirect('/swagger'));
app.use('/swagger', swaggerui);

export default app;

// TODO: add a location route to get all locations

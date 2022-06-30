import express from 'express';
import bodyParser from 'body-parser';
import swaggerui from '../swaggerRouter';
import exampleApi from '../api/changeme';
import volunteerRequestRouter from '../api/volunteerRequest';
import { API_PREFIX_V1 } from '../config';

const app = express();

app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(API_PREFIX_V1, exampleApi);
app.use(API_PREFIX_V1, volunteerRequestRouter);

app.get('/', (req, res) => res.redirect('/swagger'));
app.use('/swagger', swaggerui);

export default app;

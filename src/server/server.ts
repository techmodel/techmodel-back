import express from 'express';
import swaggerui from '../swaggerRouter';
import routes from '../api/api.routes';

import { API_PREFIX } from '../config';

const app = express();

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(API_PREFIX, routes);

app.get('/', (req, res) => res.redirect('/swagger'));
app.use('/swagger', swaggerui);

export default app;

// TODO: do we want to enable people to add any skill they want or do we want them to pick it from a predefined list?
// TODO: who should be able to add a company?
// TODO: who should be able to add an institution?
// TODO: trying to use bearer in swagger results in error when validating the token, check why

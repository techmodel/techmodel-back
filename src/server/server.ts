import express from 'express';
import swaggerui from '../swaggerRouter';
import routes from '../api/api.routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { API_PREFIX, CLIENT_URL } from '../config';

const app = express();

app.disable('x-powered-by');

app.use(cors({ origin: CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(API_PREFIX, routes);

app.get('/', (req, res) => res.redirect('/swagger'));
app.use('/swagger', swaggerui);

export default app;

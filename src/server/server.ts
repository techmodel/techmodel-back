import express from 'express';
import swaggerui from '../swaggerRouter';
import routes from '../api/api.routes';
import cors from 'cors';
import { API_PREFIX, CLIENT_URL, authConfig } from '../config';
import passport from 'passport';
import { BearerStrategy, IBearerStrategyOptionWithRequest } from 'passport-azure-ad';

const app = express();

app.disable('x-powered-by');

app.use(cors({ origin: CLIENT_URL }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
const options: IBearerStrategyOptionWithRequest = {
  identityMetadata: `https://${authConfig.metadata.b2cDomain}/${authConfig.credentials.tenantName}/${authConfig.policies.policyName}/${authConfig.metadata.version}/${authConfig.metadata.discovery}`,
  clientID: authConfig.credentials.clientID,
  audience: authConfig.credentials.clientID,
  policyName: authConfig.policies.policyName,
  isB2C: authConfig.settings.isB2C,
  validateIssuer: authConfig.settings.validateIssuer,
  passReqToCallback: authConfig.settings.passReqToCallback,
  loggingLevel: 'error'
};
export const bearerStrategy = new BearerStrategy(options, (req, token, done) => {
  done(null, {}, token);
});
passport.use(bearerStrategy);

app.use(API_PREFIX, routes);

app.get('/', (req, res) => res.redirect('/swagger'));
app.use('/swagger', swaggerui);

export default app;

// TODO: do we want to enable people to add any skill they want or do we want them to pick it from a predefined list?
// TODO: who should be able to add a company?
// TODO: who should be able to add an institution?
// TODO: trying to use bearer in swagger results in error when validating the token, check why

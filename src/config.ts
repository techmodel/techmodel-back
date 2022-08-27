/**
 * Initializes all the environment variables
 */

/**
 * Returns the desired environment variable as long as it exits or a default value is passed.
 * If none of the above is true, and error will be thrown.
 * @param name: environment variable name
 * @param defaultValue: default value if does not exist
 */
export function getEnv(name: string, defaultValue?: string): string {
  const errMsg = `Please define ${name}`;
  const env = process.env[name];
  if (!env) {
    if (defaultValue) {
      return defaultValue;
    }
    throw Error(errMsg);
  }
  return env;
}

export const APP_LOG_LEVEL = getEnv('APP_LOG_LEVEL', 'info');
export const APP_PORT = parseInt(getEnv('APP_PORT', '4000'));

export const SQL_DB_HOST = getEnv('SQL_DB_HOST');
export const SQL_DB_PORT = parseInt(getEnv('SQL_DB_PORT'));
export const SQL_DB_USERNAME = getEnv('SQL_DB_USERNAME');
export const SQL_DB_PASSWORD = getEnv('SQL_DB_PASSWORD');
export const SQL_DB_DATABASE = getEnv('SQL_DB_DATABASE');
export const SQL_INSERT_RETRY_INTERVAL_MS = parseInt(getEnv('SQL_INSERT_RETRY_INTERVAL_MS', '1000'));
export const CLIENT_URL = getEnv('CLIENT_URL', `localhost:3000`);
export const JWT_SECRET = getEnv('JWT_SECRET');
export const API_PREFIX = '/api/v1';

export const authConfig = {
  credentials: {
    tenantName: 'techmodel.onmicrosoft.com',
    clientID: '4abc99dd-3509-40c3-abdb-53b29dae9d42'
  },
  policies: {
    policyName: 'B2C_1_policyT1'
  },
  metadata: {
    b2cDomain: 'techmodel.b2clogin.com',
    authority: 'login.microsoftonline.com',
    discovery: '.well-known/openid-configuration',
    version: 'v2.0'
  },
  settings: {
    isB2C: true,
    validateIssuer: true,
    passReqToCallback: true,
    loggingLevel: 'info'
  }
};

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
export const JWT_SECRET = getEnv('JWT_SECRET');
export const API_PREFIX_V1 = '/api/v1';

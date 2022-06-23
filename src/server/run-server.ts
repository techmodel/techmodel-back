/**
 * Responsible for running the application is server.ts file
 */

import app from './server';
import logger from '../logger';
import { APP_PORT, SQL_DB_DATABASE, SQL_DB_HOST, SQL_DB_PASSWORD, SQL_DB_PORT, SQL_DB_USERNAME } from '../config';

/**
 * Function that initializes all the important parts of the application.
 */
(async function runServer(): Promise<void> {
  app.listen(APP_PORT, function() {
    logger.info(`Listening on port ${APP_PORT}`);
  });
})();

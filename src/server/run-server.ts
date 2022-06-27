/**
 * Responsible for running the application is server.ts file
 */

import app from './server';
import logger from '../logger';
import { APP_PORT } from '../config';
import '../dataSource'; // create connection pool to the db

(async function runServer(): Promise<void> {
  app.listen(APP_PORT, function() {
    logger.info(`Listening on port ${APP_PORT}`);
  });
})();

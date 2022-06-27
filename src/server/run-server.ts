/**
 * Responsible for running the application is server.ts file
 */

import app from './server';
import logger from '../logger';
import { APP_PORT } from '../config';
import { connectToDb, dataSource } from './initialize-db';

/**
 * Function that initializes all the important parts of the application.
 */
(async function runServer(): Promise<void> {
  await connectToDb(dataSource);
  app.listen(APP_PORT, function() {
    logger.info(`Listening on port ${APP_PORT}`);
  });
})();

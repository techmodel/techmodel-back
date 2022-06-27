/**
 * Application bootstrap
 */

import app from './server';
import logger from '../logger';
import { APP_PORT } from '../config';
import { appDataSource } from '../dataSource';

(async function runServer(): Promise<void> {
  await appDataSource.initialize();
  logger.info('Connection pool to the DB created');
  app.listen(APP_PORT, function() {
    logger.info(`Listening on port ${APP_PORT}`);
  });
})();

/**
 * Responsible for running the application is server.ts file
 */

import app from './server';
import logger from '../logger';
import { DataSource } from 'typeorm';
import { APP_PORT, SQL_DB_DATABASE, SQL_DB_HOST, SQL_DB_PASSWORD, SQL_DB_PORT, SQL_DB_USERNAME } from '../config';

/**
 * Function that initializes all the important parts of the application.
 */
(async function runServer(): Promise<void> {
  new DataSource({
    type: 'mssql',
    host: SQL_DB_HOST,
    port: SQL_DB_PORT,
    username: SQL_DB_USERNAME,
    password: SQL_DB_PASSWORD,
    database: SQL_DB_DATABASE,
    entities: ['src/models/*.ts']
  });

  app.listen(APP_PORT, function() {
    logger.info(`Listening on port ${APP_PORT}`);
  });
})();

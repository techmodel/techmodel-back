import { createLogger, transports, format } from 'winston';
import { APP_LOG_LEVEL } from './config';

const loggerTransports = [
  new transports.Console({
    level: 'info',
    format: format.colorize()
  })
];

const logger = createLogger({ transports: loggerTransports });

/**
 * Returns the logger for the application.
 * @param level: log level that we want to see.
 */
function getLogLevel(level: string): string {
  const levels = ['info', 'error', 'warn', 'silly', 'verbose', 'debug'];
  if (levels.includes(level)) {
    return level;
  }
  logger.warn(`LOG_LEVEL can be only one of ${levels}, received ${level}`);
  return 'info';
}
if (APP_LOG_LEVEL) {
  logger.level = getLogLevel(APP_LOG_LEVEL);
}

export default logger;

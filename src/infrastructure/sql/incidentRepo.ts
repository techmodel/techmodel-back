import { createConnection, getConnection } from 'typeorm';
import { SqlHermeticity } from './sqlHermeticity';
import { ProcessedHermeticityEnrichment, HermeticityIncident } from '../../core/hermeticity';
import { ProcessedAlertEnrichment, AlertIncident } from '../../core/alert';
import { SqlAlert } from './sqlAlert';
import { AllEnrichmentResponse, IncidentRepo } from '../../core/repository';
import { SqlRetryableError } from './exc';
import { AppError } from '../../core/exc';

const ormTimeoutError = 'ETIMEOUT';
const ormConnectionError = 'ConnectionError';

/**
 * An implementation of the `IncidentRepo` that uses typeorm & sql server.
 */
export const incidentRepo: IncidentRepo = {
  /**
   * Adds the processed hermeticity object that has been received.
   *
   * If a timeout or connection error occurs, the function will throw an error signaling that it should be retried.
   * Otherwise, it will throw a generic error.
   */
  async addHermeticity(hermeticity: ProcessedHermeticityEnrichment): Promise<void> {
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(SqlHermeticity)
        .values({
          timestamp: new Date(hermeticity.timestamp),
          origin: hermeticity.origin,
          value: hermeticity.value,
          beakID: hermeticity.beakID,
          ID: hermeticity.ID,
          status: hermeticity.status,
          hasAlert: hermeticity.hasAlert.toString()
        })
        .execute();
    } catch (error) {
      if (error.name === ormConnectionError || error.number === ormTimeoutError) {
        throw new SqlRetryableError(`Hermeticity - ${error.originalError.info.message}`, 500);
      } else {
        throw new AppError(`Hermeticity - ${error.originalError.info.message}`, 400);
      }
    }
  },
  async addAlert(alert: ProcessedAlertEnrichment): Promise<void> {
    /**
     * Adds the processed alert object that has been received.
     *
     * If a timeout or connection error occurs, the function will throw an error signaling that it should be retried.
     * Otherwise, it will throw a generic error.
     */
    try {
      await getConnection()
        .createQueryBuilder()
        .insert()
        .into(SqlAlert)
        .values({
          timestamp: new Date(alert.timestamp),
          origin: alert.origin,
          node: alert.node,
          severity: alert.severity,
          ID: alert.ID,
          description: alert.description,
          object: alert.object,
          application: alert.application,
          operator: alert.operator
        })
        .execute();
    } catch (error) {
      if (error.name === ormConnectionError || error.number === ormTimeoutError) {
        throw new SqlRetryableError(`Alert - ${error.originalError.info.message}`, 500);
      } else {
        throw new AppError(`Alert - ${error.originalError.info.message}`, 400);
      }
    }
  },
  async getAllEnrichment(): Promise<AllEnrichmentResponse> {
    try {
      // TODO: use promise.all() to await to wait for both queries in `getAllEnrichment`
      const savedHermeticity: HermeticityIncident[] = await getConnection().query('EXEC SelectAllActiveHermeticity', [
        5086
      ]);
      const savedAlert: AlertIncident[] = await getConnection().query('EXEC SelectAllActiveAlert', [5086]);
      return { alert: savedAlert, hermeticity: savedHermeticity };
    } catch (error) {
      throw new AppError(`Alert or Hermeticity- ${error}`, 500);
    }
  }
};

/**
 * Initiates a connection pool to the database.
 * @param host: database host
 * @param port: database port
 * @param username: database username
 * @param password: database password
 * @param database: database name
 */
export async function sqlCreateGlobalConnection(
  host: string,
  port: number,
  username: string,
  password: string,
  database: string
): Promise<void> {
  await createConnection({
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: ['src/infrastructure/**/*.ts']
  });
  return;
}

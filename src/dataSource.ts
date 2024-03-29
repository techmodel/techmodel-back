import { DataSource } from 'typeorm';
import { SQL_DB_DATABASE, SQL_DB_HOST, SQL_DB_PASSWORD, SQL_DB_PORT, SQL_DB_USERNAME } from './config';

export const appDataSource = new DataSource({
  type: 'mssql',
  host: SQL_DB_HOST,
  port: SQL_DB_PORT,
  username: SQL_DB_USERNAME,
  password: SQL_DB_PASSWORD,
  database: SQL_DB_DATABASE,
  entities: [__dirname + '/models/*.{js,ts}'],
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  migrationsTableName: 'migrations', // default table name is migrations
  extra: {
    trustServerCertificate: true
  }
});

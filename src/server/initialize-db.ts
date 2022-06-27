import { DataSource } from 'typeorm';
import { SQL_DB_DATABASE, SQL_DB_HOST, SQL_DB_PASSWORD, SQL_DB_PORT, SQL_DB_USERNAME } from '../config';

export const dataSource = new DataSource({
  type: 'mssql',
  host: SQL_DB_HOST,
  port: SQL_DB_PORT,
  username: SQL_DB_USERNAME,
  password: SQL_DB_PASSWORD,
  database: SQL_DB_DATABASE,
  entities: ['src/models/*.ts'],
  synchronize: true,
  logging: false
});

export const connectToDb = async (dataSource: DataSource) => {
  try {
    await dataSource.initialize();
    console.log(`Connection to db established successfully`);
  } catch (err) {
    throw new Error("Couldn't connect to db");
  }
};

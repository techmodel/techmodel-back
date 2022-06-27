import 'dotenv/config';

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SQL_DB_DATABASE, SQL_DB_HOST, SQL_DB_PASSWORD, SQL_DB_PORT, SQL_DB_USERNAME } from '../config';

const AppDataSource = new DataSource({
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

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    console.log('initialized');
    process.exit();
  })
  .catch(error => console.log(error));

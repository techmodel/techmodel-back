import 'dotenv/config';

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SQL_DB_DATABASE, SQL_DB_HOST, SQL_DB_PASSWORD, SQL_DB_PORT, SQL_DB_USERNAME } from './src/config';

if (SQL_DB_HOST != 'localhost') {
  throw Error(
    '\n*** Are you sure you want to run this not on your localhost?\nIt will DELETE the current schema including the data in the tables and create a new one'
  );
}

const AppDataSource = new DataSource({
  type: 'mssql',
  host: SQL_DB_HOST,
  port: SQL_DB_PORT,
  username: SQL_DB_USERNAME,
  password: SQL_DB_PASSWORD,
  database: SQL_DB_DATABASE,
  entities: ['src/models/*.ts'],
  synchronize: true, // ** DO NOT USE THIS IN PRODUCTION
  logging: false
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
AppDataSource.initialize()
  .then(() => {
    console.log('initialized with new schema');
    process.exit();
  })
  .catch(error => console.log(error));

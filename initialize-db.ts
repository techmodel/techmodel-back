/* eslint-disable  no-console */

import 'dotenv/config';

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SQL_DB_DATABASE, SQL_DB_HOST, SQL_DB_PASSWORD, SQL_DB_PORT, SQL_DB_USERNAME } from './src/config';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { removeSeed, seed } from './tests/seed';
import { appDataSource } from './src/dataSource';
import {
  city1,
  company1,
  company2,
  institution1,
  location1,
  program1,
  programManager1,
  skill1,
  skill1ToVolunteerRequest1,
  skill2,
  skill2ToVolunteerRequest1,
  volunteer1,
  volunteer2,
  volunteerRequest1,
  volunteerRequest1ToVolunteer1,
  volunteerRequest1ToVolunteer2
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
} from './tests/mock';

if (SQL_DB_HOST != 'localhost') {
  throw Error(
    '\n*** Are you sure you want to run this not on your localhost?\nIt will DELETE the current schema including the data in the tables and create a new one'
  );
}

const InitDataSource = new DataSource({
  type: 'mssql',
  host: SQL_DB_HOST,
  port: SQL_DB_PORT,
  username: SQL_DB_USERNAME,
  password: SQL_DB_PASSWORD,
  database: SQL_DB_DATABASE,
  entities: ['./src/models/*.ts'],
  synchronize: true, // ** DO NOT USE THIS IN PRODUCTION
  logging: false
});

// to initialize initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap
InitDataSource.initialize()
  .then(async () => {
    console.log('initialized with new schema');
    // initialize appDataSource to perform seeding
    await appDataSource.initialize();
    // seed db
    await removeSeed();
    await seed({
      cities: [city1],
      locations: [location1],
      institutions: [institution1],
      programs: [program1],
      companies: [company1, company2],
      users: [volunteer1, volunteer2, programManager1],
      volunteerRequests: [volunteerRequest1],
      volunteerRequestToVolunteers: [volunteerRequest1ToVolunteer1, volunteerRequest1ToVolunteer2],
      skills: [skill1, skill2],
      skillToVolunteerRequests: [skill1ToVolunteerRequest1, skill2ToVolunteerRequest1]
    });
    console.log('preformed seeding');
    process.exit(0);
  })
  .catch(error => console.log(error));

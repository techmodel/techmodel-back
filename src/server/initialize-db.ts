import 'dotenv/config';
import 'reflect-metadata';

import { appDataSource } from '../dataSource';

// resets the db schema to the current models
appDataSource
  .initialize()
  .then(() => {
    console.log('initiailized');
  })
  .catch(() => {
    console.log('error initiailizing db');
  });

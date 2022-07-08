require('dotenv/config');
import chai from 'chai';
import chaiPromised from 'chai-as-promised';
chai.use(chaiPromised);

import { appDataSource } from '../src/dataSource';
import { removeSeed } from './seed';

before(async () => {
  await appDataSource.initialize();
  await removeSeed();
});

after(async () => {
  appDataSource.destroy();
});

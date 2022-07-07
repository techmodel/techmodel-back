require('dotenv/config');
import chai from 'chai';
import chaiPromised from 'chai-as-promised';
import { userDecoded } from '../src/app/user';
chai.use(chaiPromised);

import * as jwt from 'jsonwebtoken';
import { appDataSource } from '../src/dataSource';
import { User } from '../src/models';
import { removeSeed } from './seed';
import { JWT_SECRET } from '../src/config';

before(async () => {
  await appDataSource.initialize();
  await removeSeed();
});

after(async () => {
  appDataSource.destroy();
});

// create test jwt using User object
export const createTestJwt = (user: User): string => {
  const payload = {
    userId: user.id,
    userType: user.userType,
    institutionId: user.institutionId || undefined,
    programId: user.programId || undefined,
    companyId: user.companyId || undefined
  } as userDecoded;
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

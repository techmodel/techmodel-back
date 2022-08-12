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
import {
  pendingProgramManager3,
  programCoordinator1,
  programManager1,
  programManager2,
  volunteer1,
  volunteer3WithoutMappings
} from './mock';

before(async () => {
  await appDataSource.initialize();
  await removeSeed();
});

after(async () => {
  appDataSource.destroy();
});

export interface HTTPError extends Error {
  status: number;
  text: string;
  method: string;
  path: string;
}

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

export const volunteer1Jwt = createTestJwt(volunteer1);
export const volunteer3WithoutMappingsJwt = createTestJwt(volunteer3WithoutMappings);
export const programCoordinator1Jwt = createTestJwt(programCoordinator1);
export const programManager2Jwt = createTestJwt(programManager2);
export const programManager1Jwt = createTestJwt(programManager1);
export const pendingProgramManager3Jwt = createTestJwt(pendingProgramManager3);

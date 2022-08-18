require('dotenv/config');
import chai from 'chai';
import chaiPromised from 'chai-as-promised';
import { userDecoded } from '../src/app/user';
chai.use(chaiPromised);

import * as jwt from 'jsonwebtoken';
import { appDataSource } from '../src/dataSource';
import { Program, User, VolunteerRequest } from '../src/models';
import { removeSeed } from './seed';
import { JWT_SECRET } from '../src/config';
import {
  pendingProgramCoordinator3,
  programCoordinator1,
  programCoordinator2,
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

export const expectedVolunteerRequest = (vr: VolunteerRequest, program: Program, currentVolunteers: number): any => {
  const returnedVolunteerRequest = {
    ...vr,
    createdAt: vr.createdAt.toISOString(),
    updatedAt: vr.updatedAt.toISOString(),
    startDate: vr.startDate.toISOString(),
    startTime: vr.startTime.toISOString(),
    endDate: vr.endDate.toISOString(),
    skillToVolunteerRequest: vr.skillToVolunteerRequest || [],
    currentVolunteers: currentVolunteers || 0,
    program: {
      id: program.id,
      name: program.name,
      description: program.description
    }
  };
  return returnedVolunteerRequest;
};

export const volunteer1Jwt = createTestJwt(volunteer1);
export const volunteer3WithoutMappingsJwt = createTestJwt(volunteer3WithoutMappings);
export const programCoordinator1Jwt = createTestJwt(programCoordinator1);
export const programCoordinator2Jwt = createTestJwt(programCoordinator2);
export const programManager2Jwt = createTestJwt(programManager2);
export const programManager1Jwt = createTestJwt(programManager1);
export const pendingProgramManager3Jwt = createTestJwt(pendingProgramCoordinator3);

require('dotenv/config');
import chai from 'chai';
import chaiPromised from 'chai-as-promised';
import { userDecoded } from '../src/app/user';
chai.use(chaiPromised);

import * as jwt from 'jsonwebtoken';
import { appDataSource } from '../src/dataSource';
import { Program, ProgramToInstitution, Skill, User, VolunteerRequest } from '../src/models';
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
import { ReturnVolunteerRequestDTO } from '../src/app/dto/volunteerRequest';
import sinon from 'sinon';
import * as middlewares from '../src/api/middlewares';
import { ReturnProgramDTO } from '../src/app/dto/program';

// disable verifyGoogleAuthToken
sinon.stub(middlewares, 'verifyGoogleAuthTokenLogin').callsFake(async (req, res, next) => next());
sinon.stub(middlewares, 'verifyGoogleAuthTokenRegister').callsFake(async (req, res, next) => next());

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

export const expectedVolunteerRequest = (
  vr: VolunteerRequest,
  program: Program,
  currentVolunteers: number,
  skills?: Skill[],
  volunteers?: User[]
): ReturnVolunteerRequestDTO => {
  const returnedVolunteerRequest: ReturnVolunteerRequestDTO = {
    id: vr.id,
    createdAt: vr.createdAt.toISOString(),
    updatedAt: vr.updatedAt.toISOString(),
    name: vr.name,
    audience: vr.audience,
    isPhysical: vr.isPhysical,
    description: vr.description,
    startDate: vr.startDate.toISOString(),
    endDate: vr.endDate.toISOString(),
    durationTimeAmount: vr.durationTimeAmount,
    durationTimeUnit: vr.durationTimeUnit,
    frequencyTimeAmount: vr.frequencyTimeAmount,
    frequencyTimeUnit: vr.frequencyTimeUnit,
    startTime: vr.startTime.toISOString(),
    totalVolunteers: vr.totalVolunteers,
    currentVolunteers: currentVolunteers || 0,
    status: vr.status,
    institutionId: vr.institutionId,
    language: vr.language,
    creatorId: vr.creatorId,
    program: {
      id: program.id,
      name: program.name,
      description: program.description
    },
    creator: {
      id: vr.creator.id,
      email: vr.creator.email,
      phone: vr.creator.phone,
      firstName: vr.creator.firstName,
      lastName: vr.creator.lastName,
      userType: vr.creator.userType,
      programId: vr.creator.programId!,
      institutionId: vr.creator.institutionId
    }
  };
  if (skills && skills.length != 0) {
    returnedVolunteerRequest.skills = skills.map(skill => ({ id: skill.id, name: skill.name, type: skill.type }));
  }
  if (volunteers && volunteers.length != 0) {
    returnedVolunteerRequest.volunteers = volunteers.map(volunteer => ({
      id: volunteer.id,
      email: volunteer.email,
      phone: volunteer.phone,
      firstName: volunteer.firstName,
      lastName: volunteer.lastName,
      userType: volunteer.userType,
      companyName: volunteer.company.name
    }));
  }
  return returnedVolunteerRequest;
};

export const expectedProgram = (program: Program, linkedInstitutions: ProgramToInstitution[]): ReturnProgramDTO => {
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    institutionIds: linkedInstitutions.map(mapping => mapping.institutionId)
  };
};

export const volunteer1Jwt = createTestJwt(volunteer1);
export const volunteer3WithoutMappingsJwt = createTestJwt(volunteer3WithoutMappings);
export const programCoordinator1Jwt = createTestJwt(programCoordinator1);
export const programCoordinator2Jwt = createTestJwt(programCoordinator2);
export const programManager2Jwt = createTestJwt(programManager2);
export const programManager1Jwt = createTestJwt(programManager1);
export const pendingProgramManager3Jwt = createTestJwt(pendingProgramCoordinator3);

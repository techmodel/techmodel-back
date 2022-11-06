import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import request from 'supertest';
import logger from '../src/logger';
import { User, UserType } from '../src/models';
import { userRepository } from '../src/repos';
import {
  city1,
  city2,
  company1,
  institution1,
  institution2,
  location1,
  program1,
  program2,
  programCoordinator1,
  programManager1,
  volunteer1
} from './mock';
import { removeSeed, seed } from './seed';
import {
  createTestJwt,
  HTTPError,
  programCoordinator1Jwt,
  programManager1Jwt,
  programManager2Jwt,
  volunteer1Jwt
} from './setup';
import * as middlewares from '../src/api/middlewares';
let app: Express.Application;

const newUserPayload = {
  id: 'testid123143141234123543521351134',
  firstName: 'test123',
  lastName: 'test123',
  email: 'test123@gmail.com',
  phone: '+972524210000',
  userType: UserType.PROGRAM_COORDINATOR,
  institutionId: institution1.id,
  programId: program1.id
};

const checkCreateUserFails = async (payload: unknown, expectedError: string, errorStatus: number): Promise<void> => {
  const res = await request(app)
    .post(`/api/v1/auth/register`)
    .send({ user: payload });
  expect(res.status).to.eq(errorStatus);
  expect((res.error as HTTPError).text).to.eq(expectedError);
};

describe('register', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // disable verifyGoogleAuthToken
    const verifyGoogleAuthTokenStub = sandbox.stub(middlewares, 'verifyGoogleAuthToken').callsFake(async (req, res, next) => {
      next() 
    });
    app = require('../src/server/server').default;    
    // seed db
    await seed({
      cities: [city1, city2],
      locations: [location1],
      programs: [program1, program2],
      companies: [company1],
      institutions: [institution1, institution2],
      users: [programManager1, programCoordinator1]
    });
  });

  describe('register program coordinator', async () => {
    it('returns 422 when payload violates schema', async () => {
      await checkCreateUserFails(
        { ...newUserPayload, id: undefined },
        'Error validating schema, "id" is required',
        422
      );
      await checkCreateUserFails(
        { ...newUserPayload, companyId: company1.id },
        'Error validating schema, "companyId" must be [null]',
        422
      );
    });

    it('creates user as pending when request is successful', async () => {
      const res = await request(app)
        .post(`/api/v1/auth/register`)
        .send({ user: newUserPayload });
      expect(res.status).to.eq(302);
      const newCreatedUser = (await userRepository.findOneBy({ id: newUserPayload.id })) as User;
      expect(newCreatedUser.userType).to.eq(UserType.PENDING);
    });

    it('shows the new pending user as a pending coordinator in the program', async () => {
      const res = await request(app)
        .post(`/api/v1/auth/register`)
        .send({ user: newUserPayload });
      expect(res.status).to.eq(302);
      const pendingCoordinatorsRes = await request(app)
        .get(`/api/v1/programs/${program1.id}/pending-coordinators`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(pendingCoordinatorsRes.status).to.eq(200);
      const pendingUserIds = pendingCoordinatorsRes.body.map((v: { userId: unknown }) => v.userId);
      // const pendingCoordinatorIds = pendingCoordinatorsRes.body.map(v => v.id);
      expect(pendingUserIds).to.include.members([newUserPayload.id]);
    });
  });

  this.afterEach(async () => {
    sandbox.restore();
    await removeSeed();
  });
});

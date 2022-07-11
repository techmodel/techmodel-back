import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import request from 'supertest';
import logger from '../src/logger';
import { User } from '../src/models';
import { userRepository } from '../src/repos';
import app from '../src/server/server';
import {
  program1, programCoordinator1,
  programManager1, volunteer1
} from './mock';
import { removeSeed, seed } from './seed';
import { createTestJwt, HTTPError } from './setup';

describe('user', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      programs: [program1],
      users: [programManager1]
    });
  });

  describe('updateUserInfo', async () => {
    it('returns 422 when volunteer tries to update programId', async () => {
      const volunteer1Jwt = createTestJwt(volunteer1);
      const userInfo = {
        programId: 1
      };
      const res = await request(app)
        .put(`/api/v1/user/update-info`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`)
        .send({ userInfo });
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`Can't update inaccessible user info`);
    });

    it('returns 422 when coordinator tries to update companyId', async () => {
      const coordinatorJwt = createTestJwt(programCoordinator1);
      const userInfo = {
        companyId: 1
      };
      const res = await request(app)
        .put(`/api/v1/user/update-info`)
        .set('Authorization', `Bearer ${coordinatorJwt}`)
        .send({ userInfo });
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`Can't update inaccessible user info`);
    });

    it('returns 422 when manager tries to update institutionId', async () => {
      const managerJwt = createTestJwt(programManager1);
      const userInfo = {
        institutionId: 1
      };
      const res = await request(app)
        .put(`/api/v1/user/update-info`)
        .set('Authorization', `Bearer ${managerJwt}`)
        .send({ userInfo });
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`Can't update inaccessible user info`);
    });

    it('Successfully updates user', async () => {
      const managerJwt = createTestJwt(programManager1);
      const userInfo = {
        programId: 1,
        firstName: `first`
      };
      const res = await request(app)
        .put(`/api/v1/user/update-info`)
        .set('Authorization', `Bearer ${managerJwt}`)
        .send({ userInfo });
      expect(res.status).to.eq(204);
      const managerUser = (await userRepository.findOneBy({ id: programManager1.id })) as User;
      expect(managerUser.programId).to.eq(1);
      expect(managerUser.firstName).to.eq(`first`);
    });
  });

  this.afterEach(async () => {
    sandbox.restore();
    await removeSeed();
  });
});

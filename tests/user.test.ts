import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import request from 'supertest';
import logger from '../src/logger';
import { User } from '../src/models';
import { userRepository, volunteerRequestRepository } from '../src/repos';
import app from '../src/server/server';
import {
  city1,
  city2,
  company1,
  fullVolunteerRequest1,
  institution1,
  institution2,
  location1,
  oldVolunteerRequest1,
  program1,
  program2,
  volunteerRequest1,
  volunteerRequestToUpdate,
  volunteerRequestToVolunteers,
  volunteer1,
  volunteer2,
  programManager1,
  volunteer3WithoutMappings,
  programCoordinator1,
  programManager2,
  programCoordinator2,
  company2
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

const programId1UpdatePayload = {
  programId: program1.id
};

const companyId1UpdatePayload = {
  companyId: company1.id
};

const institutionId1UpdatePayload = {
  institutionId: institution1.id
};

const checkUserUpdateFails = async (
  userJwt: string,
  userId: string,
  payload: unknown,
  expectedError: string
): Promise<void> => {
  const res = await request(app)
    .put(`/api/v1/user/${userId}`)
    .set('Authorization', `Bearer ${userJwt}`)
    .send({ userInfo: payload });
  expect(res.status).to.eq(422);
  expect((res.error as HTTPError).text).to.eq(expectedError);
};

describe('user', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      cities: [city1, city2],
      locations: [location1],
      programs: [program1, program2],
      companies: [company1, company2],
      institutions: [institution1, institution2],
      users: [
        volunteer1,
        volunteer2,
        programManager1,
        volunteer3WithoutMappings,
        programCoordinator1,
        programManager2,
        programCoordinator2
      ]
    });
  });

  describe('updateUserInfo', async () => {
    it('returns 422 when volunteer tries to update non allowed fields', async () => {
      const volunteer1Jwt = createTestJwt(volunteer1);
      await checkUserUpdateFails(
        volunteer1Jwt,
        volunteer1.id,
        programId1UpdatePayload,
        'Error validating schema, "programId" is not allowed'
      );
      await checkUserUpdateFails(
        volunteer1Jwt,
        volunteer1.id,
        institutionId1UpdatePayload,
        'Error validating schema, "institutionId" is not allowed'
      );
    });

    it('returns 422 when coordinator tries to update companyId', async () => {
      const coordinatorJwt = createTestJwt(programCoordinator1);
      await checkUserUpdateFails(
        coordinatorJwt,
        programCoordinator1.id,
        companyId1UpdatePayload,
        'Error validating schema, "companyId" must be [null]'
      );
      await checkUserUpdateFails(
        coordinatorJwt,
        programCoordinator1.id,
        institutionId1UpdatePayload,
        'Error validating schema, "institutionId" is not allowed'
      );
      await checkUserUpdateFails(
        coordinatorJwt,
        programCoordinator1.id,
        programId1UpdatePayload,
        'Error validating schema, "programId" is not allowed'
      );
    });

    it('returns 422 when manager tries to update institutionId', async () => {
      const managerJwt = createTestJwt(programManager1);
      await checkUserUpdateFails(
        managerJwt,
        programManager1.id,
        companyId1UpdatePayload,
        'Error validating schema, "companyId" must be [null]'
      );
      await checkUserUpdateFails(
        managerJwt,
        programManager1.id,
        institutionId1UpdatePayload,
        'Error validating schema, "institutionId" is not allowed'
      );
      await checkUserUpdateFails(
        managerJwt,
        programManager1.id,
        programId1UpdatePayload,
        'Error validating schema, "programId" is not allowed'
      );
    });

    it('Successfully updates user', async () => {
      const managerJwt = createTestJwt(programManager1);
      const userInfo = {
        firstName: `first`
      };
      const res = await request(app)
        .put(`/api/v1/user/${programManager1.id}`)
        .set('Authorization', `Bearer ${managerJwt}`)
        .send({ userInfo });
      const managerUser = (await userRepository.findOneBy({ id: programManager1.id })) as User;
      expect(res.status).to.eq(204);
      expect(managerUser.firstName).to.eq(`first`);
    });
  });

  describe('update user institution', function() {
    it('should change institution when request is correct', async () => {
      const res = await request(app)
        .put(`/api/v1/user/${programCoordinator1.id}/institution`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ newInstitutionId: institution2.id });
      const user = (await userRepository.findOneBy({ id: programCoordinator1.id })) as User;
      expect(res.status).to.eq(204);
      expect(user.institutionId).to.eq(institution2.id);
    });
    it('should return 404 if user is not found', async () => {
      const res = await request(app)
        .put(`/api/v1/user/nonexistinguser/institution`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ newInstitutionId: institution2.id });
      expect(res.status).to.eq(404);
      expect((res.error as HTTPError).text).to.eq(`User not found`);
    });
    it('should return 403 if coordinator tries to execute', async () => {
      const res = await request(app)
        .put(`/api/v1/user/${programCoordinator1.id}/institution`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send({ newInstitutionId: institution2.id });
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`You are not authorized to perform this action`);
    });
    it('should return 403 if volunteer tries to execute', async () => {
      const res = await request(app)
        .put(`/api/v1/user/${programCoordinator1.id}/institution`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`)
        .send({ newInstitutionId: institution2.id });
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`You are not authorized to perform this action`);
    });
    it('should return 403 if manager from another program is trying to execute', async () => {
      const res = await request(app)
        .put(`/api/v1/user/${programCoordinator1.id}/institution`)
        .set('Authorization', `Bearer ${programManager2Jwt}`)
        .send({ newInstitutionId: institution2.id });
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`Trying to access different program coordinator`);
    });
    it('should return 403 if manager from another program is trying to execute', async () => {
      const res = await request(app)
        .put(`/api/v1/user/${programCoordinator1.id}/institution`)
        .set('Authorization', `Bearer ${programManager2Jwt}`)
        .send({ newInstitutionId: institution2.id });
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`Trying to access different program coordinator`);
    });
    it('should return 422 if target user is not a coordinator', async () => {
      const res = await request(app)
        .put(`/api/v1/user/${volunteer1.id}/institution`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ newInstitutionId: institution2.id });
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`Target user is not a coordinator`);
    });
  });

  describe('delete user', function() {
    it('should change the personal info of the deleted user', async () => {
      const res = await request(app)
        .delete(`/api/v1/user`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send();
      const user = (await userRepository.findOneBy({ id: programCoordinator1.id })) as User;
      expect(res.status).to.eq(200);
      expect(user).to.eq(null);
    });
    it('should perform logout at the end', async () => {
      const res = await request(app)
        .delete(`/api/v1/user`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send();
      expect(res.headers['set-cookie'][0])
        .to.contain('user-data')
        .to.contain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    });
    it('should remove from open volunteer requests if user type is volunteer', async () => {
      await seed({
        volunteerRequests: [volunteerRequest1, oldVolunteerRequest1, fullVolunteerRequest1, volunteerRequestToUpdate],
        volunteerRequestToVolunteers: volunteerRequestToVolunteers
      });
      let vrRes = await volunteerRequestRepository.volunteerRequestsByVolunteerId(volunteer1.id);
      let openRequests = vrRes.filter(request => request.startDate > new Date());
      expect(openRequests.length).to.eq(2);
      vrRes = await volunteerRequestRepository.volunteerRequestsByVolunteerId(volunteer2.id);
      openRequests = vrRes.filter(request => request.startDate > new Date());
      expect(openRequests.length).to.eq(1);
      const res = await request(app)
        .delete(`/api/v1/user`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`)
        .send();
      expect(res.status).to.eq(200);
      vrRes = await volunteerRequestRepository.volunteerRequestsByVolunteerId(volunteer1.id);
      openRequests = vrRes.filter(request => request.startDate > new Date());
      expect(openRequests.length).to.eq(0);
      vrRes = await volunteerRequestRepository.volunteerRequestsByVolunteerId(volunteer2.id);
      openRequests = vrRes.filter(request => request.startDate > new Date());
      expect(openRequests.length).to.eq(1); // this user should not be affected by the deletion of other user
    });
    it('should return 405 if program manger tries to execute', async () => {
      const res = await request(app)
        .delete(`/api/v1/user`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(
        `You are a program manger, please contact site administrators to delete your user`
      );
    });
  });

  this.afterEach(async () => {
    sandbox.restore();
    await removeSeed();
  });
});

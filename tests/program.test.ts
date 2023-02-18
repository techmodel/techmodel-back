import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server/server';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import {
  expectedProgram,
  expectedVolunteerRequest,
  HTTPError,
  programCoordinator1Jwt,
  programCoordinator2Jwt,
  programManager1Jwt,
  programManager2Jwt,
  volunteer1Jwt
} from './setup';
import {
  city1,
  city2,
  company1,
  company2,
  fullVolunteerRequest1,
  institution1,
  institution2,
  location1,
  oldVolunteerRequest1,
  pendingProgramCoordinator3,
  pendingProgramCoordinator3SecondPart,
  pendingProgramCoordinator4,
  pendingProgramCoordinator4SecondPart,
  program1,
  program1ToInstitution1,
  program1ToInstitution2,
  program2,
  programCoordinator1,
  programCoordinator2,
  programCoordinator3,
  programManager1,
  programManager2,
  skill1,
  skill1ToVolunteerRequest1,
  skill2,
  skill2ToVolunteerRequest1,
  volunteer1,
  volunteer2,
  volunteerRequest1,
  volunteerRequestInstitution1Program2,
  volunteerRequestToVolunteers
} from './mock';
import { Institution, PendingProgramCoordinator, User, UserType } from '../src/models';
import { pendingProgramCoordinatorRepository, userRepository } from '../src/repos';

const expectedPendingProgramCoordinator = (
  pedningCoordinator: PendingProgramCoordinator,
  pendingUser: User,
  institution: Institution
): any => {
  return {
    ...pedningCoordinator,
    createdAt: pedningCoordinator.createdAt.toISOString(),
    user: { ...pendingUser, createdAt: pendingUser.createdAt.toISOString() },
    institution: { ...institution, createdAt: institution.createdAt.toISOString() }
  };
};

describe('programs', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      cities: [city1, city2],
      locations: [location1],
      institutions: [institution1, institution2],
      programs: [program1, program2],
      companies: [company1, company2],
      users: [
        volunteer1,
        volunteer2,
        programManager1,
        programCoordinator1,
        programManager2,
        programCoordinator2,
        programCoordinator3,
        pendingProgramCoordinator3,
        pendingProgramCoordinator4
      ],
      volunteerRequests: [
        volunteerRequest1,
        fullVolunteerRequest1,
        oldVolunteerRequest1,
        volunteerRequestInstitution1Program2
      ],
      volunteerRequestToVolunteers: volunteerRequestToVolunteers,
      pendingProgramCoordinators: [pendingProgramCoordinator3SecondPart, pendingProgramCoordinator4SecondPart],
      skills: [skill1, skill2],
      skillToVolunteerRequests: [skill1ToVolunteerRequest1, skill2ToVolunteerRequest1],
      programToInstitutions: [program1ToInstitution1, program1ToInstitution2]
    });
  });

  it('returns list of programs', async function() {
    const res = await request(app).get(`/api/v1/programs`);
    expect(res.body).to.eql([
      expectedProgram(program1, [program1ToInstitution1, program1ToInstitution2]),
      expectedProgram(program2, [])
    ]);
  });

  describe('coordinators of a program', function() {
    it('returns only coordinators related to the specific program', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/coordinators`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.body).to.eql([
        { ...programCoordinator1, createdAt: programCoordinator1.createdAt.toISOString() },
        { ...programCoordinator2, createdAt: programCoordinator2.createdAt.toISOString() }
      ]);
    });

    it('returns 403 when coordinator tries to access', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/coordinators`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });

    it('returns 403 when volunteer tries to access', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/coordinators`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });
  });

  describe('volunteer requests of a program', function() {
    it('returns volunteer-requests open and related to the specific program if executed by manager', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/volunteer-requests`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.body).to.eql([
        expectedVolunteerRequest(
          volunteerRequest1,
          program1,
          2,
          [skill1, skill2],
          [
            { ...volunteer1, company: company1 },
            { ...volunteer2, company: company2 }
          ]
        ),
        expectedVolunteerRequest(oldVolunteerRequest1, program1, 1, [], [{...volunteer1, company: company1 }]),
        expectedVolunteerRequest(fullVolunteerRequest1, program1, 1, [], [{ ...volunteer1, company: company1 }])
      ]);
    });

    it('returns volunteer requests open and related to a specific program and institution if executed by coordinator', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/volunteer-requests`)
        .set('Authorization', `Bearer ${programCoordinator2Jwt}`);
      expect(res.body).to.eql([
        expectedVolunteerRequest(fullVolunteerRequest1, program1, 1, [], [{ ...volunteer1, company: company1 }])
      ]);
    });

    it('returns volunteer requests that start after start date and related to a specific program if start date is passed', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/volunteer-requests?startDate=${new Date().toISOString()}`)
        .set('Authorization', `Bearer ${programCoordinator2Jwt}`);
      expect(res.body).to.eql([
        expectedVolunteerRequest(fullVolunteerRequest1, program1, 1, [], [{ ...volunteer1, company: company1 }])
      ]);
    });

    it('returns 403 when target program does not equal to user program', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program2.id}/volunteer-requests`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('Trying to access another program data');
      expect(res.status).to.eq(403);
    });

    it('returns 403 when volunteer tries to access', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/volunteer-requests`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });
  });

  describe('pending coordinators of the program', function() {
    it('returns list of users that are pending to become coordinators of the program', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/pending-coordinators`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.status).to.eq(200);
      expect(res.body).to.eql([
        expectedPendingProgramCoordinator(
          pendingProgramCoordinator3SecondPart,
          pendingProgramCoordinator3,
          institution1
        )
      ]);
    });

    it('return 403 if manager tries to access different program', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program2.id}/pending-coordinators`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('Trying to access another program data');
      expect(res.status).to.eq(403);
    });
  });

  describe('accept pending coordinator', function() {
    it('throws 403 if trying to access different program', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator3.id}/accept`)
        .set('Authorization', `Bearer ${programManager2Jwt}`)
        .send();
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`Trying to access another program data`);
    });
    it('throws 403 if called by coordinator', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator3.id}/accept`)
        .set('Authorization', `Bearer ${programCoordinator2Jwt}`)
        .send();
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`You are not authorized to perform this action`);
    });
    it('throws 422 if user is not program manager from the same program', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator4.id}/accept`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`Target user is not from the same program`);
    });
    it('throws 404 if no there is no user with such id', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/pending-coordinators/test13/accept`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(404);
      expect((res.error as HTTPError).text).to.eq(`Target user not found`);
    });
    it('throws 404 if the user is not pending', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/pending-coordinators/${programCoordinator1.id}/accept`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(404);
      expect((res.error as HTTPError).text).to.eq(`Target user not found`);
    });
    it('updates the user correctly on successful request', async function() {
      const targetUser = await userRepository.findOne({ where: { id: pendingProgramCoordinator3.id } });
      expect(targetUser?.userType).to.eq('pending');
      expect(targetUser?.institutionId).to.eq(null);
      expect(targetUser?.programId).to.eq(null);
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator3.id}/accept`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(200);
      const updatedUser = await userRepository.findOne({ where: { id: pendingProgramCoordinator3.id } });
      expect(updatedUser?.userType).to.eq(UserType.PROGRAM_COORDINATOR);
      expect(updatedUser?.institutionId).to.eq(pendingProgramCoordinator3SecondPart.institutionId);
      expect(updatedUser?.programId).to.eq(pendingProgramCoordinator3SecondPart.programId);
    });
    it('removes pending user on successful request without touching the user itself', async function() {
      let targetPendingCoordinator = await pendingProgramCoordinatorRepository.findOne({
        where: { userId: pendingProgramCoordinator3.id }
      });
      expect(targetPendingCoordinator?.id).to.eq(pendingProgramCoordinator3SecondPart.id);
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator3.id}/accept`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(200);
      targetPendingCoordinator = await pendingProgramCoordinatorRepository.findOne({
        where: { userId: pendingProgramCoordinator3.id }
      });
      expect(targetPendingCoordinator).to.eq(null);
      const updatedUser = await userRepository.findOne({ where: { id: pendingProgramCoordinator3.id } });
      expect(updatedUser?.userType).to.eq(UserType.PROGRAM_COORDINATOR);
    });
  });

  describe('deny pending coordinator', function() {
    it('throws 403 if trying to access different program', async function() {
      const res = await request(app)
        .delete(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator3.id}`)
        .set('Authorization', `Bearer ${programManager2Jwt}`)
        .send();
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`Trying to access another program data`);
    });
    it('throws 403 if called by coordinator', async function() {
      const res = await request(app)
        .delete(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator3.id}`)
        .set('Authorization', `Bearer ${programCoordinator2Jwt}`)
        .send();
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`You are not authorized to perform this action`);
    });
    it('throws 422 if user is not program manager from the same program', async function() {
      const res = await request(app)
        .delete(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator4.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`Target user is not from the same program`);
    });
    it('throws 404 if no there is no user with such id', async function() {
      const res = await request(app)
        .delete(`/api/v1/programs/${program1.id}/pending-coordinators/test13`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(404);
      expect((res.error as HTTPError).text).to.eq(`Target user not found`);
    });
    it('throws 404 if the user is not pending', async function() {
      const res = await request(app)
        .delete(`/api/v1/programs/${program1.id}/pending-coordinators/${programCoordinator1.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(404);
      expect((res.error as HTTPError).text).to.eq(`Target user not found`);
    });
    it('deletes the pending user and the pending coordinator row on successful request', async function() {
      let targetPendingCoordinator = await pendingProgramCoordinatorRepository.findOne({
        where: { userId: pendingProgramCoordinator3.id }
      });
      expect(targetPendingCoordinator?.id).to.eq(pendingProgramCoordinator3SecondPart.id);
      let targetUser = await userRepository.findOne({
        where: { id: pendingProgramCoordinator3.id }
      });
      expect(targetUser?.id).to.eq(pendingProgramCoordinator3.id);
      const res = await request(app)
        .delete(`/api/v1/programs/${program1.id}/pending-coordinators/${pendingProgramCoordinator3.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(200);
      targetPendingCoordinator = await pendingProgramCoordinatorRepository.findOne({
        where: { userId: pendingProgramCoordinator3.id }
      });
      expect(targetPendingCoordinator).to.eq(null);
      targetUser = await userRepository.findOne({
        where: { id: pendingProgramCoordinator3.id }
      });
      expect(targetUser).to.eq(null);
    });
  });

  describe('stats', function() {
    it('returns stats if program manger requests it', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/stats`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(200);
      expect(res.body).to.eql({
        relatedInstitutions: 2,
        coordinators: 2,
        vrOpen: 1,
        vrClosed: 2,
        volunteers: 2
      });
    });
    it('throws 403 if the user is not program manager', async function() {
      let res = await request(app)
        .delete(`/api/v1/programs/${program1.id}/pending-coordinators/${programCoordinator1.id}`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send();
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`You are not authorized to perform this action`);
      res = await request(app)
        .delete(`/api/v1/programs/${program1.id}/pending-coordinators/${programCoordinator1.id}`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`)
        .send();
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`You are not authorized to perform this action`);
    });
    it('throws 403 if the user is requesting stats on program he is not part of', async function() {
      const res = await request(app)
        .delete(`/api/v1/programs/${program2.id}/pending-coordinators/${programCoordinator1.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send();
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`Trying to access another program data`);
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

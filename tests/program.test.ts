import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server/server';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import {
  expectedVolunteerRequest,
  HTTPError,
  programCoordinator1Jwt,
  programCoordinator2Jwt,
  programManager1Jwt,
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
  program1,
  program2,
  programCoordinator1,
  programCoordinator2,
  programCoordinator3,
  programManager1,
  programManager2,
  volunteer1,
  volunteer2,
  volunteerRequest1,
  volunteerRequestInstitution1Program2
} from './mock';

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
        programCoordinator3
      ],
      volunteerRequests: [
        volunteerRequest1,
        fullVolunteerRequest1,
        oldVolunteerRequest1,
        volunteerRequestInstitution1Program2
      ]
    });
  });

  it('returns list of programs', async function() {
    const res = await request(app).get(`/api/v1/programs`);
    expect(res.body).to.eql([program1, program2]);
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
    it.only('returns volunteer-requests open and related to the specific program if executed by manager', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/volunteer-requests`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.body).to.eql([
        expectedVolunteerRequest(volunteerRequest1, 0),
        expectedVolunteerRequest(fullVolunteerRequest1, 0)
      ]);
    });

    it.only('returns volunteer requests open and related to a specific program and institution if executed by coordinator', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/volunteer-requests`)
        .set('Authorization', `Bearer ${programCoordinator2Jwt}`);
      expect(res.body).to.eql([expectedVolunteerRequest(fullVolunteerRequest1, 0)]);
    });

    it.only('returns volunteer requests that start after start date and related to a specific program if start date is passed', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/volunteer-requests?startDate=${new Date().toISOString()}`)
        .set('Authorization', `Bearer ${programCoordinator2Jwt}`);
      expect(res.body).to.eql([expectedVolunteerRequest(fullVolunteerRequest1, 0)]);
    });

    it.only('returns 403 when target program does not equal to user program', async function() {
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

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

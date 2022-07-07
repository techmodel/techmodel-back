import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import request from 'supertest';
import { appDataSource } from '../src/dataSource';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import {
  city1,
  company1,
  company2,
  institution1,
  location1,
  oldVolunteerRequest1,
  program1,
  programManager1,
  skill1,
  skill1ToVolunteerRequest1,
  skill2,
  skill2ToVolunteerRequest1,
  volunteer1,
  volunteer2,
  volunteer3WithoutMappings,
  volunteerRequest1,
  volunteerRequestToVolunteers
} from './mock';
import app from '../src/server/server';
import { userRepository, volunteerRequestRepository } from '../src/repos';
import { CannotPerformOperationError, NotFoundError } from '../src/exc';
import { createTestJwt } from './setup';

describe('volunteerRequest', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      cities: [city1],
      locations: [location1],
      institutions: [institution1],
      programs: [program1],
      companies: [company1, company2],
      users: [volunteer1, volunteer2, programManager1, volunteer3WithoutMappings],
      volunteerRequests: [volunteerRequest1, oldVolunteerRequest1],
      volunteerRequestToVolunteers: volunteerRequestToVolunteers,
      skills: [skill1, skill2],
      skillToVolunteerRequests: [skill1ToVolunteerRequest1, skill2ToVolunteerRequest1]
    });
  });

  describe('volunteerRequestsByVolunteerId', function() {
    it('returns the volunteer requests relevant for the volunteer', async function() {
      const volunteer1MappedRequestIds = volunteerRequestToVolunteers
        .filter(mapping => mapping.volunteerId === volunteer1.id)
        .map(mapping => ({ id: mapping.volunteerRequestId }));
      const dbVolunteer1MappedRequestIds = await (
        await volunteerRequestRepository.volunteerRequestsByVolunteerId(volunteer1.id)
      ).map(request => ({ id: request.id }));
      expect(volunteer1MappedRequestIds).to.eql(dbVolunteer1MappedRequestIds);
    });
    it('returns the right count of mapped volunteers to the request', async function() {
      const dbVolunteerRequest1 = await (
        await volunteerRequestRepository.volunteerRequestsByVolunteerId(volunteer1.id)
      ).filter(vr => vr.id === volunteerRequest1.id)[0];
      const mappedVolunteersToVolunteerRequest1 = volunteerRequestToVolunteers.filter(
        mapping => mapping.volunteerRequestId === volunteerRequest1.id
      ).length;
      expect(dbVolunteerRequest1.currentVolunteers).to.eq(mappedVolunteersToVolunteerRequest1);
    });
    it('returns empty list if no requests are found for the volunteer', async function() {
      const requestForVolunteer3 = await volunteerRequestRepository.volunteerRequestsByVolunteerId(
        volunteer3WithoutMappings.id
      );
      expect(requestForVolunteer3.length).to.eq(0);
    });
  });

  describe('deleteVolunteerFromRequest', function() {
    const volunteer1Jwt = createTestJwt(volunteer1);

    it('deletes the mapped volunteer to the request if the volunteer is trying to delete himself', async function() {
      const initialVolunteer1MappedRequests = await volunteerRequestRepository.volunteerRequestsByVolunteerId(
        volunteer1.id
      );
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`);
      expect(res.status).to.eq(200);
      await volunteerRequestRepository.volunteerRequestsByVolunteerId(volunteer1.id);
      const currentVolunteer1MappedRequests = await volunteerRequestRepository.volunteerRequestsByVolunteerId(
        volunteer1.id
      );
      expect(currentVolunteer1MappedRequests.length).to.be.eq(initialVolunteer1MappedRequests.length - 1);
    });

    it('throws error when trying to delete mapping to older request', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${oldVolunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`);
      expect(res.status).to.eq(422);
      expect((res.error as any).text).to.eq('Cannot delete mapped volunteers from old request');
    });

    it('throws error when trying to delete mapping to not found request', async function() {
      await expect(volunteerRequestRepository.deleteVolunteerFromRequest(453453, volunteer1.id)).to.be.rejectedWith(
        NotFoundError
      );
    });

    it('throws error when trying to delete mapping that doesnt exist', async function() {
      await expect(
        volunteerRequestRepository.deleteVolunteerFromRequest(volunteerRequest1.id, volunteer3WithoutMappings.id)
      ).to.be.rejectedWith(NotFoundError);
    });
  });

  this.afterEach(function() {
    sandbox.restore();
  });

  this.afterAll(async function() {
    await removeSeed();
  });
});

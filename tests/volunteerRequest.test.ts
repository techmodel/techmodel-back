import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import request from 'supertest';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import {
  city1,
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
  programManager1,
  programManager2,
  skill1,
  skill1ToVolunteerRequest1,
  skill2,
  skill2ToVolunteerRequest1,
  volunteer1,
  volunteer2,
  volunteer3WithoutMappings,
  volunteerRequest1,
  volunteerRequestToCreate,
  volunteerRequestToUpdate,
  volunteerRequestToVolunteers
} from './mock';
import app from '../src/server/server';
import { volunteerRequestRepository } from '../src/repos';
import {
  HTTPError,
  programCoordinator1Jwt,
  programManager1Jwt,
  programManager2Jwt,
  volunteer1Jwt,
  volunteer3WithoutMappingsJwt
} from './setup';

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
      institutions: [institution1, institution2],
      programs: [program1, program2],
      companies: [company1, company2],
      users: [volunteer1, volunteer2, programManager1, volunteer3WithoutMappings, programCoordinator1, programManager2],
      volunteerRequests: [volunteerRequest1, oldVolunteerRequest1, fullVolunteerRequest1, volunteerRequestToUpdate],
      volunteerRequestToVolunteers: volunteerRequestToVolunteers,
      skills: [skill1, skill2],
      skillToVolunteerRequests: [skill1ToVolunteerRequest1, skill2ToVolunteerRequest1]
    });
  });

  describe('volunteer requests by volunteer id', function() {
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

  describe('assign volunteer to volunteer request', function() {
    it('returns 401 when called by program manager or program coordinator', async function() {
      let res = await request(app)
        .post(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
      res = await request(app)
        .post(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });
    it('assigns volunteer to the volunteer request if everything is ok', async function() {
      let volunteer3WithoutMappingsRequests = await volunteerRequestRepository.volunteerRequestsByVolunteerId(
        volunteer3WithoutMappings.id
      );
      expect(volunteer3WithoutMappingsRequests.length).to.eq(0);
      const res = await request(app)
        .post(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers`)
        .set('Authorization', `Bearer ${volunteer3WithoutMappingsJwt}`);
      expect(res.status).to.eq(200);
      volunteer3WithoutMappingsRequests = await volunteerRequestRepository.volunteerRequestsByVolunteerId(
        volunteer3WithoutMappings.id
      );
      expect(volunteer3WithoutMappingsRequests.length).to.eq(1);
      expect(volunteer3WithoutMappingsRequests[0].id).to.eq(volunteerRequest1.id);
    });
    it('returns 404 if volunteer request is not found', async function() {
      const res = await request(app)
        .post(`/api/v1/volunteer-requests/635645terst/volunteers`)
        .set('Authorization', `Bearer ${volunteer3WithoutMappingsJwt}`);
      expect((res.error as HTTPError).text).to.eq('Volunteer request not found');
      expect(res.status).to.eq(404);
    });
    it('returns 422 if volunteer request is too old', async function() {
      const res = await request(app)
        .post(`/api/v1/volunteer-requests/${oldVolunteerRequest1.id}/volunteers`)
        .set('Authorization', `Bearer ${volunteer3WithoutMappingsJwt}`);
      expect((res.error as HTTPError).text).to.eq('Cannot assign volunteer to old request');
      expect(res.status).to.eq(422);
    });
    it('returns 422 if volunteer request is full', async function() {
      const res = await request(app)
        .post(`/api/v1/volunteer-requests/${fullVolunteerRequest1.id}/volunteers`)
        .set('Authorization', `Bearer ${volunteer3WithoutMappingsJwt}`);
      expect((res.error as HTTPError).text).to.eq('Volunteer request is full');
      expect(res.status).to.eq(422);
    });
  });

  describe('delete volunteer from request', function() {
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

    it('returns 422 when trying to delete mapping to older request', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${oldVolunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`);
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq('Cannot delete mapped volunteers from old request');
    });

    it('returns 404 when trying to delete mapping to not found request', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${453453}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('Volunteer request not found');
      expect(res.status).to.eq(404);
    });

    it('returns 404 when trying to delete mapping that doesnt exist', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers/${volunteer3WithoutMappings.id}`)
        .set('Authorization', `Bearer ${volunteer3WithoutMappingsJwt}`);
      expect((res.error as HTTPError).text).to.eq('Volunteer is not mapped to the request');
      expect(res.status).to.eq(404);
    });

    it('returns 403 when as a volunteer trying to delete mapping not related to him', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${volunteer3WithoutMappingsJwt}`);
      expect((res.error as HTTPError).text).to.eq('As a volunteer, you are not allowed to delete this volunteer');
      expect(res.status).to.eq(403);
    });

    it('returns 403 when as a program coordinator trying to delete mapping not related to a volunteer request he created', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect((res.error as HTTPError).text).to.eq(
        'As a program coordinator, you are not allowed to delete this volunteer'
      );
      expect(res.status).to.eq(403);
    });

    it('returns 403 when as a program manager trying to delete mapping from a volunteer request where the creator is not from the program', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${programManager2Jwt}`);
      expect((res.error as HTTPError).text).to.eq('As a program manager, you are not allowed to delete this volunteer');
      expect(res.status).to.eq(403);
    });

    it('returns 401 when trying to perform the action without working jwt', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer test`);
      expect((res.error as HTTPError).text).to.eq('Couldnt verify token');
      expect(res.status).to.eq(401);
    });
  });

  describe('set volunteer reqeust as deleted', function() {
    it('chagnes the status of the volunteer request to `deleted`', async function() {
      let targetVolunteerRequest = await volunteerRequestRepository.requestById(volunteerRequest1.id);
      if (!targetVolunteerRequest) {
        throw new Error('Volunteer request not found');
      }
      expect(targetVolunteerRequest.status).to.eq('sent');
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.status).to.eq(200);
      targetVolunteerRequest = await volunteerRequestRepository.requestById(volunteerRequest1.id);
      if (!targetVolunteerRequest) {
        throw new Error('Volunteer request not found');
      }
      expect(targetVolunteerRequest.status).to.eq('deleted');
    });

    it('returns 422 when trying to delete old request', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${oldVolunteerRequest1.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq('Cannot delete old request');
    });

    it('returns 404 when request is not found', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${453453}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('Volunteer request not found');
      expect(res.status).to.eq(404);
    });

    it('returns 403 when as a volunteer trying to delete a request', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });

    it('returns 403 when as a program coordinator trying to delete request he did not created', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect((res.error as HTTPError).text).to.eq(
        'As a program coordinator, you are not allowed to delete this request'
      );
      expect(res.status).to.eq(403);
    });

    it('returns 403 when as a program manager trying to delete a volunteer request where the creator is not from the program', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer ${programManager2Jwt}`);
      expect((res.error as HTTPError).text).to.eq('As a program manager, you are not allowed to delete this request');
      expect(res.status).to.eq(403);
    });

    it('returns 401 when trying to perform the action without working jwt', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer test`);
      expect((res.error as HTTPError).text).to.eq('Couldnt verify token');
      expect(res.status).to.eq(401);
    });
  });

  describe('Create volunteer request', () => {
    it('returns 422 when request creator is not the logged in user', async () => {
      const res = await request(app)
        .post(`/api/v1/volunteer-requests`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ volunteerRequestToCreate });
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`Can't create request in the name of someone else`);
    });

    it('successfully creates volunteer request', async () => {
      const res = await request(app)
        .post(`/api/v1/volunteer-requests`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ volunteerRequestToCreate });
      expect(res.status).to.eq(200);
      const newVolunteerRequest = await volunteerRequestRepository.findOneBy({ name: volunteerRequestToCreate.name });
      expect(newVolunteerRequest).to.not.be.null;
    });
  });

  describe('Update volunteer request', () => {
    const volunteerRequestUpdateData = { audience: 10 };
    it('returns 400 when id is missing from request or equals 0', async () => {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/0`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ volunteerRequestUpdateData });
      expect(res.status).to.eq(400);
      expect((res.error as HTTPError).text).to.eq(`Missing Id to update volunteer request by`);
    });

    it('returns 422 when caller and request creator are not from the same program', async () => {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer ${programManager2Jwt}`)
        .send({ volunteerRequestUpdateData });
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`You are not allowed to update this request`);
    });

    it('returns 422 when caller and request creator are from the same program but not the same institution and caller is a program coordinator ', async () => {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/${volunteerRequestToUpdate.id}`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send({ volunteerRequestUpdateData });
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`You are not allowed to update this request`);
    });

    it('successfully updates volunteer request', async () => {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/${volunteerRequestToUpdate.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ volunteerRequestUpdateData });
      const newVolunteerRequest = await volunteerRequestRepository.findOneBy({ id: volunteerRequestToUpdate.id });
      expect(newVolunteerRequest?.audience).to.equal(volunteerRequestUpdateData.audience);
      expect(res.status).to.eq(204);
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

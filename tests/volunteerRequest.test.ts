import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import request from 'supertest';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
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
  expectedVolunteerRequest,
  HTTPError,
  pendingProgramManager3Jwt,
  programCoordinator1Jwt,
  programCoordinator2Jwt,
  programManager1Jwt,
  programManager2Jwt,
  volunteer1Jwt,
  volunteer3WithoutMappingsJwt
} from './setup';
import { Audience } from '../src/models';
import { CreateVolunteerRequestDTO, UpdateVolunteerRequestDTO } from '../src/app/dto/volunteerRequest';

const vrToCreatePayload = (vr: CreateVolunteerRequestDTO): Partial<CreateVolunteerRequestDTO> => ({
  name: vr.name,
  audience: vr.audience,
  isPhysical: vr.isPhysical,
  description: vr.description,
  startDate: vr.startDate,
  endDate: vr.endDate,
  durationTimeAmount: vr.durationTimeAmount,
  durationTimeUnit: vr.durationTimeUnit,
  frequencyTimeAmount: vr.frequencyTimeAmount,
  frequencyTimeUnit: vr.frequencyTimeUnit,
  startTime: vr.startTime,
  totalVolunteers: vr.totalVolunteers,
  language: vr.language,
  institutionId: vr.institutionId,
  programId: vr.programId,
  creatorId: vr.creatorId,
  skills: vr.skills
});

describe('volunteerRequest', function() {
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
        volunteer3WithoutMappings,
        programCoordinator1,
        programManager2,
        programCoordinator2
      ],
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

  describe('relevant and open volunteer requests', function() {
    it('returns only the relevant and open volunteer requests', async function() {
      let res = await request(app)
        .get(`/api/v1/volunteer-requests`)
        .set('Authorization', `Bearer ${volunteer3WithoutMappingsJwt}`);
      expect(res.body.length).to.eq(3);
      expect(res.body).to.eql([
        expectedVolunteerRequest(volunteerRequest1, program1, 2, [skill1, skill2]),
        expectedVolunteerRequest(oldVolunteerRequest1, program1, 1, [], [{...volunteer1, company: company1}]),
        expectedVolunteerRequest(volunteerRequestToUpdate, program1, 0, [], [{...volunteer1, company: company1 }])
      ]);

      res = await request(app)
        .get(`/api/v1/volunteer-requests`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`);
      expect(res.body.length).to.eq(1);
      expect(res.body).to.eql([expectedVolunteerRequest(volunteerRequestToUpdate, program1, 0)]);
    });
    //TODO: Add test to test this doesn't return requests the user is assigned to
    // it(`returns only the relevant and open volunteer requests that user isn't assigned to`, async function() {
    //   const res = await request(app)
    //   .get(`/api/v1/volunteer-requests`)
    //   .set('Authorization', `Bearer ${volunteer1Jwt}`);
    //   expect(res.body).to.eql([
    //     expectedVolunteerRequest(volunteerRequest1, program1, 2, [skill1, skill2]),
    //     expectedVolunteerRequest(volunteerRequestToUpdate, program1, 0)
    //   ]);
    // });
  });

  describe('assign volunteer to volunteer request', function() {
    it('returns 401 when called by program manager or program coordinator or pending user', async function() {
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
      res = await request(app)
        .post(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers`)
        .set('Authorization', `Bearer ${pendingProgramManager3Jwt}`);
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

    it('returns 403 when as a program coordinator trying to delete mapping not related to an institution and program he is in', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${fullVolunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect((res.error as HTTPError).text).to.eq(
        'As a program coordinator, you are not allowed to delete this volunteer'
      );
      expect(res.status).to.eq(403);
    });

    it('returns 403 when as a program manager trying to delete mapping from a volunteer request where the request is not from the program', async function() {
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

    it('returns 403 when pending user trying to perform action', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}/volunteers/${volunteer1.id}`)
        .set('Authorization', `Bearer ${pendingProgramManager3Jwt}`);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });
  });

  describe('set volunteer reqeust as deleted', function() {
    it('chagnes the status of the volunteer request to `deleted` and updates `updatedAt`', async function() {
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
      expect(targetVolunteerRequest.updatedAt).to.be.greaterThan(volunteerRequest1.updatedAt);
    });

    it('chagnes the status of the volunteer request to `deleted` and updates `updatedAt` when coordinator performs', async function() {
      let targetVolunteerRequest = await volunteerRequestRepository.requestById(volunteerRequest1.id);
      if (!targetVolunteerRequest) {
        throw new Error('Volunteer request not found');
      }
      expect(targetVolunteerRequest.status).to.eq('sent');
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect(res.status).to.eq(200);
      targetVolunteerRequest = await volunteerRequestRepository.requestById(volunteerRequest1.id);
      if (!targetVolunteerRequest) {
        throw new Error('Volunteer request not found');
      }
      expect(targetVolunteerRequest.status).to.eq('deleted');
      expect(targetVolunteerRequest.updatedAt).to.be.greaterThan(volunteerRequest1.updatedAt);
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
        .set('Authorization', `Bearer ${programCoordinator2Jwt}`);
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(
        'As a program coordinator, you are not allowed to delete this request'
      );
    });

    it('returns 403 when as a program manager trying to delete a volunteer request where the request is not from the program', async function() {
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

    it('returns 403 when pending user trying to perform action', async function() {
      const res = await request(app)
        .delete(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer ${pendingProgramManager3Jwt}`);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });
  });

  describe('Create volunteer request', () => {
    it('trying to pass parameters not allowed results in error', async () => {
      const createPayload = vrToCreatePayload(volunteerRequestToCreate);
      const res = await request(app)
        .post(`/api/v1/volunteer-requests`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send({ ...createPayload, blah: 'test' });
      expect(res.status).to.eq(422);
      expect((res.error as HTTPError).text).to.eq(`Error validating schema, "blah" is not allowed`);
    });

    it('successfully creates volunteer request', async () => {
      const createPayload = vrToCreatePayload(volunteerRequestToCreate);
      const res = await request(app)
        .post(`/api/v1/volunteer-requests`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send(createPayload);
      expect(res.status).to.eq(200);
      const newVolunteerRequest = await volunteerRequestRepository.findOne({
        where: { name: volunteerRequestToCreate.name },
        relations: ['skillToVolunteerRequest']
      });
      if (!newVolunteerRequest) throw new Error('Volunteer request not found');
      expect(newVolunteerRequest.institutionId).to.eq(volunteerRequestToCreate.institutionId);
      expect(newVolunteerRequest.programId).to.eq(volunteerRequestToCreate.programId);
      expect(newVolunteerRequest);
      expect(newVolunteerRequest.status).to.eq('sent');
      expect(newVolunteerRequest.creatorId).to.eq(volunteerRequestToCreate.creatorId);
      expect(newVolunteerRequest.skillToVolunteerRequest[0].skillId).to.eq(
        (volunteerRequestToCreate.skills as number[])[0]
      );
    });
  });

  describe('Update volunteer request', () => {
    const volunteerRequestUpdateData: UpdateVolunteerRequestDTO = { audience: Audience.MEDIUM, skills: [skill1.id] };
    it('returns 400 when id is missing from request or equals 0', async () => {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/0`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send(volunteerRequestUpdateData);
      expect(res.status).to.eq(400);
      expect((res.error as HTTPError).text).to.eq(`Missing Id to update volunteer request by`);
    });

    it('returns 403 when a program manager tries to update request not from his program', async () => {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/${volunteerRequest1.id}`)
        .set('Authorization', `Bearer ${programManager2Jwt}`)
        .send(volunteerRequestUpdateData);
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`Manager cant update request for other program`);
    });

    it('returns 403 when a program coordinator tries to update request not from his program and institution', async () => {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/${volunteerRequestToUpdate.id}`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send(volunteerRequestUpdateData);
      expect(res.status).to.eq(403);
      expect((res.error as HTTPError).text).to.eq(`Coordinator cant update request for other program or institution`);
    });

    it('successfully updates volunteer request', async () => {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/${volunteerRequestToUpdate.id}`)
        .set('Authorization', `Bearer ${programCoordinator2Jwt}`)
        .send(volunteerRequestUpdateData);
      const updatedVolunteerRequest = await volunteerRequestRepository.findOne({
        where: { id: volunteerRequestToUpdate.id },
        relations: ['skillToVolunteerRequest', 'skillToVolunteerRequest.skill']
      });
      if (!updatedVolunteerRequest) throw new Error('Volunteer request not found');
      expect(updatedVolunteerRequest.audience).to.equal(volunteerRequestUpdateData.audience);
      expect(updatedVolunteerRequest.updatedAt).to.be.greaterThan(volunteerRequestToUpdate.createdAt); // make sure `updatedAt` is updated
      expect(updatedVolunteerRequest.skillToVolunteerRequest[0].skill.id).to.be.eq(skill1.id);
      expect(updatedVolunteerRequest.skillToVolunteerRequest.length).to.be.eq(1);
      expect(res.status).to.eq(204);
    });

    it('sending empty skill list will remove all mapped skills', async () => {
      const createPayload = vrToCreatePayload(volunteerRequestToCreate);
      let res = await request(app)
        .post(`/api/v1/volunteer-requests`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send(createPayload);
      expect(res.status).to.eq(200);
      const newVolunteerRequest = await volunteerRequestRepository.findOne({
        where: { name: volunteerRequestToCreate.name },
        relations: ['skillToVolunteerRequest']
      });
      if (!newVolunteerRequest) {
        throw new Error('no volunteer request found');
      }
      expect(newVolunteerRequest.skillToVolunteerRequest.length).to.eq(1);

      res = await request(app)
        .put(`/api/v1/volunteer-requests/${newVolunteerRequest.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ skills: [] });

      const updatedVolunteerRequest = await volunteerRequestRepository.findOne({
        where: { name: volunteerRequestToCreate.name },
        relations: ['skillToVolunteerRequest']
      });
      if (!updatedVolunteerRequest) {
        throw new Error('no volunteer request found');
      }
      expect(updatedVolunteerRequest.skillToVolunteerRequest.length).to.eq(0);
    });

    it('returns 403 when pending user trying to perform action', async function() {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/${volunteerRequestToUpdate.id}`)
        .set('Authorization', `Bearer ${pendingProgramManager3Jwt}`)
        .send(volunteerRequestUpdateData);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });

    it('returns 403 when volunteer trying to perform action', async function() {
      const res = await request(app)
        .put(`/api/v1/volunteer-requests/${volunteerRequestToUpdate.id}`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`)
        .send(volunteerRequestUpdateData);
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

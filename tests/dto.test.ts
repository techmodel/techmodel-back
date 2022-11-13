import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import {
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
  volunteerRequest1ToVolunteer1,
  volunteerRequest1ToVolunteer2,
  volunteerRequestToCreate,
  volunteerRequestToUpdate,
  volunteerRequestToVolunteers
} from './mock';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { city1, city2, volutneerRequestDTO1 } from './mock';
import app from '../src/server/server';
import {
  mapCreateVolunteerRequestDtoToDomain,
  mapVolunteerRequestToReturnVolunteerRequestDTO
} from '../src/app/dto/volunteerRequest';
import { VolunteerRequest } from '../src/models';
import { volunteerRequestRepository } from '../src/repos';

const returnVolunteerRequestMock: VolunteerRequest = {
  ...volunteerRequest1,
  program: program1,
  skillToVolunteerRequest: [
    { ...skill1ToVolunteerRequest1, skill: skill1 },
    { ...skill2ToVolunteerRequest1, skill: skill2 }
  ]
};

const returnVolunteerRequestWithVolunteersMock: VolunteerRequest = {
  ...returnVolunteerRequestMock,
  volunteerRequestToVolunteer: [
    { ...volunteerRequest1ToVolunteer1, volunteer: { ...volunteer1, company: company1 } },
    { ...volunteerRequest1ToVolunteer2, volunteer: { ...volunteer2, company: company2 } }
  ]
};

describe('DTOs', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
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

  describe('mapCreateVolunteerRequestDtoToDomain', function() {
    it('should return a proper domain volunteer request object', async function() {
      const domainVr = mapCreateVolunteerRequestDtoToDomain(volutneerRequestDTO1);
      expect(domainVr.constructor.name).to.eq('VolunteerRequest');
      expect(domainVr.createdAt).to.eq(volutneerRequestDTO1.createdAt);
      expect(domainVr.name).to.eq(volutneerRequestDTO1.name);
      expect(domainVr.audience).to.eq(volutneerRequestDTO1.audience);
      expect(domainVr.isPhysical).to.eq(volutneerRequestDTO1.isPhysical);
      expect(domainVr.description).to.eq(volutneerRequestDTO1.description);
      expect(domainVr.startDate).to.eq(volutneerRequestDTO1.startDate);
      expect(domainVr.endDate).to.eq(volutneerRequestDTO1.endDate);
      expect(domainVr.durationTimeAmount).to.eq(volutneerRequestDTO1.durationTimeAmount);
      expect(domainVr.durationTimeUnit).to.eq(volutneerRequestDTO1.durationTimeUnit);
      expect(domainVr.frequencyTimeAmount).to.eq(volutneerRequestDTO1.frequencyTimeAmount);
      expect(domainVr.frequencyTimeUnit).to.eq(volutneerRequestDTO1.frequencyTimeUnit);
      expect(domainVr.startTime).to.eq(volutneerRequestDTO1.startTime);
      expect(domainVr.totalVolunteers).to.eq(volutneerRequestDTO1.totalVolunteers);
      expect(domainVr.institutionId).to.eq(volutneerRequestDTO1.institutionId);
      expect(domainVr.programId).to.eq(volutneerRequestDTO1.programId);
      expect(domainVr.creatorId).to.eq(volutneerRequestDTO1.creatorId);
      expect(domainVr.skillToVolunteerRequest).to.containSubset(
        volutneerRequestDTO1.skills?.map(skillId => ({ skillId }))
      );
    });
  });

  describe('mapVolunteerRequestToReturnVolunteerRequestDTO', function() {
    it('returns the dto the right way, with no volunteers if there are none in the domain object', async function() {
      const returnDTO = mapVolunteerRequestToReturnVolunteerRequestDTO(returnVolunteerRequestMock);
      expect(returnDTO.createdAt).to.eq(returnVolunteerRequestMock.createdAt.toISOString());
      expect(returnDTO.name).to.eq(returnVolunteerRequestMock.name);
      expect(returnDTO.audience).to.eq(returnVolunteerRequestMock.audience);
      expect(returnDTO.isPhysical).to.eq(returnVolunteerRequestMock.isPhysical);
      expect(returnDTO.description).to.eq(returnVolunteerRequestMock.description);
      expect(returnDTO.startDate).to.eq(returnVolunteerRequestMock.startDate.toISOString());
      expect(returnDTO.endDate).to.eq(returnVolunteerRequestMock.endDate.toISOString());
      expect(returnDTO.durationTimeAmount).to.eq(returnVolunteerRequestMock.durationTimeAmount);
      expect(returnDTO.durationTimeUnit).to.eq(returnVolunteerRequestMock.durationTimeUnit);
      expect(returnDTO.frequencyTimeAmount).to.eq(returnVolunteerRequestMock.frequencyTimeAmount);
      expect(returnDTO.frequencyTimeUnit).to.eq(returnVolunteerRequestMock.frequencyTimeUnit);
      expect(returnDTO.startTime).to.eq(returnVolunteerRequestMock.startTime.toISOString());
      expect(returnDTO.totalVolunteers).to.eq(returnVolunteerRequestMock.totalVolunteers);
      expect(returnDTO.status).to.eq(returnVolunteerRequestMock.status);
      expect(returnDTO.institutionId).to.eq(returnVolunteerRequestMock.institutionId);
      expect(returnDTO.program).to.eqls({
        id: returnVolunteerRequestMock.program.id,
        name: returnVolunteerRequestMock.program.name,
        description: returnVolunteerRequestMock.program.description
      });
      expect(returnDTO.language).to.eq(returnVolunteerRequestMock.language);
      expect(returnDTO.skills).to.containSubset(
        returnVolunteerRequestMock.skillToVolunteerRequest.map(skillToRequest => ({
          id: skillToRequest.skillId,
          name: skillToRequest.skill.name,
          type: skillToRequest.skill.type
        }))
      );
      expect(returnDTO.volunteers).to.eq(undefined);
    });

    it('returns the dto the right way, with volunteers if there are in the domain object', async function() {
      const returnDTO = mapVolunteerRequestToReturnVolunteerRequestDTO(returnVolunteerRequestWithVolunteersMock);
      expect(returnDTO.createdAt).to.eq(returnVolunteerRequestWithVolunteersMock.createdAt.toISOString());
      expect(returnDTO.name).to.eq(returnVolunteerRequestWithVolunteersMock.name);
      expect(returnDTO.audience).to.eq(returnVolunteerRequestWithVolunteersMock.audience);
      expect(returnDTO.isPhysical).to.eq(returnVolunteerRequestWithVolunteersMock.isPhysical);
      expect(returnDTO.description).to.eq(returnVolunteerRequestWithVolunteersMock.description);
      expect(returnDTO.startDate).to.eq(returnVolunteerRequestWithVolunteersMock.startDate.toISOString());
      expect(returnDTO.endDate).to.eq(returnVolunteerRequestWithVolunteersMock.endDate.toISOString());
      expect(returnDTO.durationTimeAmount).to.eq(returnVolunteerRequestWithVolunteersMock.durationTimeAmount);
      expect(returnDTO.durationTimeUnit).to.eq(returnVolunteerRequestWithVolunteersMock.durationTimeUnit);
      expect(returnDTO.frequencyTimeAmount).to.eq(returnVolunteerRequestWithVolunteersMock.frequencyTimeAmount);
      expect(returnDTO.frequencyTimeUnit).to.eq(returnVolunteerRequestWithVolunteersMock.frequencyTimeUnit);
      expect(returnDTO.startTime).to.eq(returnVolunteerRequestWithVolunteersMock.startTime.toISOString());
      expect(returnDTO.totalVolunteers).to.eq(returnVolunteerRequestWithVolunteersMock.totalVolunteers);
      expect(returnDTO.status).to.eq(returnVolunteerRequestWithVolunteersMock.status);
      expect(returnDTO.institutionId).to.eq(returnVolunteerRequestWithVolunteersMock.institutionId);
      expect(returnDTO.program).to.eqls({
        id: returnVolunteerRequestWithVolunteersMock.program.id,
        name: returnVolunteerRequestWithVolunteersMock.program.name,
        description: returnVolunteerRequestWithVolunteersMock.program.description
      });
      expect(returnDTO.language).to.eq(returnVolunteerRequestWithVolunteersMock.language);
      expect(returnDTO.skills).to.containSubset(
        returnVolunteerRequestWithVolunteersMock.skillToVolunteerRequest.map(skillToRequest => ({
          id: skillToRequest.skillId,
          name: skillToRequest.skill.name,
          type: skillToRequest.skill.type
        }))
      );
      expect(returnDTO.volunteers).to.containSubset(
        returnVolunteerRequestWithVolunteersMock.volunteerRequestToVolunteer.map(requestToVolunteer => ({
          id: requestToVolunteer.volunteer.id,
          email: requestToVolunteer.volunteer.email,
          phone: requestToVolunteer.volunteer.phone,
          firstName: requestToVolunteer.volunteer.firstName,
          lastName: requestToVolunteer.volunteer.lastName,
          userType: requestToVolunteer.volunteer.userType,
          companyName: requestToVolunteer.volunteer.company.name
        }))
      );
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

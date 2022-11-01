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
  volunteerRequestToCreate,
  volunteerRequestToUpdate,
  volunteerRequestToVolunteers
} from './mock';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { city1, city2, volutneerRequestDTO1 } from './mock';
import app from '../src/server/server';
import { volunteerRequestDtoToDomain } from '../src/app/dto/volunteerRequest';
import { VolunteerRequest } from '../src/models';
import { volunteerRequestRepository } from '../src/repos';

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

  describe('volunteer request DTO', function() {
    it('should return a proper domain volunteer request object', async function() {
      const domainVr = volunteerRequestDtoToDomain(volutneerRequestDTO1);
      expect(domainVr.constructor.name).to.eq('VolunteerRequest');
      expect(domainVr.createdAt).to.eq(volutneerRequestDTO1.createdAt);
      expect(domainVr.name).to.eq(volutneerRequestDTO1.name);
      expect(domainVr.audience).to.eq(volutneerRequestDTO1.audience);
      expect(domainVr.isPhysical).to.eq(volutneerRequestDTO1.isPhysical);
      expect(domainVr.description).to.eq(volutneerRequestDTO1.description);
      expect(domainVr.startDate).to.eq(volutneerRequestDTO1.startDate);
      expect(domainVr.endDate).to.eq(volutneerRequestDTO1.endDate);
      expect(domainVr.duration).to.eq(volutneerRequestDTO1.duration);
      expect(domainVr.startTime).to.eq(volutneerRequestDTO1.startTime);
      expect(domainVr.totalVolunteers).to.eq(volutneerRequestDTO1.totalVolunteers);
      expect(domainVr.status).to.eq(volutneerRequestDTO1.status);
      expect(domainVr.institutionId).to.eq(volutneerRequestDTO1.institutionId);
      expect(domainVr.programId).to.eq(volutneerRequestDTO1.programId);
      expect(domainVr.skillToVolunteerRequest).to.containSubset(
        volutneerRequestDTO1.skills?.map(skillId => ({ skillId }))
      );
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

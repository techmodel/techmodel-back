import chai, { expect } from 'chai';
import chaiSubset from 'chai-subset';
chai.use(chaiSubset);
import sinon, { SinonSandbox } from 'sinon';
import {
  company1,
  company2,
  createInstitutionDTO1,
  program1,
  program1ToInstitution1,
  program1ToInstitution2,
  program2,
  skill1,
  skill1ToVolunteerRequest1,
  skill2,
  skill2ToVolunteerRequest1,
  volunteer1,
  volunteer2,
  volunteerRequest1,
  volunteerRequest1ToVolunteer1,
  volunteerRequest1ToVolunteer2
} from './mock';
import logger from '../src/logger';
import { volutneerRequestDTO1 } from './mock';
import {
  mapCreateVolunteerRequestDtoToDomain,
  mapVolunteerRequestToReturnVolunteerRequestDTO
} from '../src/app/dto/volunteerRequest';
import { Program, VolunteerRequest } from '../src/models';
import { mapPrgoramToProgramDTO } from '../src/app/dto/program';
import { mapCreateInstitutionDtoToDomain } from '../src/app/dto/institution';

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

const domainProgramWith2InstitutionsMock: Program = {
  ...program1,
  programToInstitution: [program1ToInstitution1, program1ToInstitution2]
};

describe('DTOs', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
  });

  describe('mapPrgoramToProgramDTO', function() {
    it('should return proper program DTO object', async function() {
      const dtoProgram = mapPrgoramToProgramDTO(domainProgramWith2InstitutionsMock);
      expect(dtoProgram.id).to.eq(domainProgramWith2InstitutionsMock.id);
      expect(dtoProgram.name).to.eq(domainProgramWith2InstitutionsMock.name);
      expect(dtoProgram.description).to.eq(domainProgramWith2InstitutionsMock.description);
      expect(dtoProgram.institutionIds).to.eql(
        domainProgramWith2InstitutionsMock.programToInstitution?.map(mapping => mapping.institutionId)
      );
    });

    it('should return empty list if no institutions are mapped', async function() {
      const dtoProgram = mapPrgoramToProgramDTO(program2);
      expect(dtoProgram.id).to.eq(program2.id);
      expect(dtoProgram.name).to.eq(program2.name);
      expect(dtoProgram.description).to.eq(program2.description);
      expect(dtoProgram.institutionIds).to.eql([]);
    });
  });

  describe('mapCreateVolunteerRequestDtoToDomain', function() {
    it('should return a proper domain volunteer request object', async function() {
      const domainVr = mapCreateVolunteerRequestDtoToDomain(volutneerRequestDTO1);
      expect(domainVr.constructor.name).to.eq('VolunteerRequest');
      expect(domainVr.name).to.eq(volutneerRequestDTO1.name);
      expect(domainVr.audience).to.eq(volutneerRequestDTO1.audience);
      expect(domainVr.isPhysical).to.eq(volutneerRequestDTO1.isPhysical);
      expect(domainVr.description).to.eq(volutneerRequestDTO1.description);
      expect(domainVr.startDate.toISOString()).to.eq(volutneerRequestDTO1.startDate.toISOString());
      expect(domainVr.endDate.toISOString()).to.eq(volutneerRequestDTO1.endDate.toISOString());
      expect(domainVr.durationTimeAmount).to.eq(volutneerRequestDTO1.durationTimeAmount);
      expect(domainVr.durationTimeUnit).to.eq(volutneerRequestDTO1.durationTimeUnit);
      expect(domainVr.frequencyTimeAmount).to.eq(volutneerRequestDTO1.frequencyTimeAmount);
      expect(domainVr.frequencyTimeUnit).to.eq(volutneerRequestDTO1.frequencyTimeUnit);
      expect(domainVr.startTime.toISOString()).to.eq(volutneerRequestDTO1.startTime.toISOString());
      expect(domainVr.totalVolunteers).to.eq(volutneerRequestDTO1.totalVolunteers);
      expect(domainVr.institutionId).to.eq(volutneerRequestDTO1.institutionId);
      expect(domainVr.programId).to.eq(volutneerRequestDTO1.programId);
      expect(domainVr.creatorId).to.eq(volutneerRequestDTO1.creatorId);
      expect(domainVr.skillToVolunteerRequest).to.containSubset(
        volutneerRequestDTO1.skills?.map(skillId => ({ skillId }))
      );
    });
  });

  describe('mapCreateInstitutionDtoToDomain', function() {
    it('should return a proper domain institution object', async function() {
      const domainVr = mapCreateInstitutionDtoToDomain(createInstitutionDTO1);
      expect(domainVr.constructor.name).to.eq('Institution');
      expect(domainVr.name).to.eq(createInstitutionDTO1.name);
      expect(domainVr.address).to.eq(createInstitutionDTO1.address);
      expect(domainVr.locationId).to.eq(createInstitutionDTO1.locationId);
      expect(domainVr.cityId).to.eq(createInstitutionDTO1.cityId);
      expect(domainVr.populationType).to.eq(createInstitutionDTO1.populationType);
      expect(domainVr.institutionType).to.eq(createInstitutionDTO1.institutionType);
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
      expect(returnDTO.creator).to.eqls({
        id: returnVolunteerRequestMock.creator.id,
        email: returnVolunteerRequestMock.creator.email,
        phone: returnVolunteerRequestMock.creator.phone,
        firstName: returnVolunteerRequestMock.creator.firstName,
        lastName: returnVolunteerRequestMock.creator.lastName,
        userType: returnVolunteerRequestMock.creator.userType,
        programId: returnVolunteerRequestMock.creator.programId!,
        institutionId: returnVolunteerRequestMock.creator.institutionId
      });
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
      expect(returnDTO.creator).to.eqls({
        id: returnVolunteerRequestWithVolunteersMock.creator.id,
        email: returnVolunteerRequestWithVolunteersMock.creator.email,
        phone: returnVolunteerRequestWithVolunteersMock.creator.phone,
        firstName: returnVolunteerRequestWithVolunteersMock.creator.firstName,
        lastName: returnVolunteerRequestWithVolunteersMock.creator.lastName,
        userType: returnVolunteerRequestWithVolunteersMock.creator.userType,
        programId: returnVolunteerRequestWithVolunteersMock.creator.programId!,
        institutionId: returnVolunteerRequestWithVolunteersMock.creator.institutionId
      });
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
  });
});

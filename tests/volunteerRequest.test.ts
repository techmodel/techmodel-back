require('dotenv/config');
import chai from 'chai';
import chaiPromised from 'chai-as-promised';
const expect = chai.expect;
chai.use(chaiPromised);
import sinon, { SinonSandbox } from 'sinon';
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
  oldVolunteerRequest1ToVolunteer1,
  program1,
  programManager1,
  skill1,
  skill1ToVolunteerRequest1,
  skill2,
  skill2ToVolunteerRequest1,
  volunteer1,
  volunteer2,
  volunteer3,
  volunteerRequest1,
  volunteerRequest1ToVolunteer1,
  volunteerRequest1ToVolunteer2
} from './mock';
import { volunteerRequestRepository } from '../src/repos';
import { CannotPerformOperationError, NotFoundError } from '../src/exc';

describe('app', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeAll(async function() {
    await appDataSource.initialize();
  });

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
      users: [volunteer1, volunteer2, programManager1, volunteer3],
      volunteerRequests: [volunteerRequest1, oldVolunteerRequest1],
      volunteerRequestToVolunteers: [
        volunteerRequest1ToVolunteer1,
        volunteerRequest1ToVolunteer2,
        oldVolunteerRequest1ToVolunteer1
      ],
      skills: [skill1, skill2],
      skillToVolunteerRequests: [skill1ToVolunteerRequest1, skill2ToVolunteerRequest1]
    });
  });

  describe('deleteVolunteerFromRequest', function() {
    it('must delete the mapped volunteer to the request', async function() {
      const initialVolunteer1MappedRequests = await volunteerRequestRepository.volunteerRequestsByVolunteerId(
        volunteer1.id
      );
      await volunteerRequestRepository.deleteVolunteerFromRequest(volunteerRequest1.id, volunteer1.id);
      await volunteerRequestRepository.volunteerRequestsByVolunteerId(volunteer1.id);
      const currentVolunteer1MappedRequests = await volunteerRequestRepository.volunteerRequestsByVolunteerId(
        volunteer1.id
      );
      expect(currentVolunteer1MappedRequests.length).to.be.eq(initialVolunteer1MappedRequests.length - 1);
    });

    it('throws error when trying to delete mapping to older request', async function() {
      await expect(
        volunteerRequestRepository.deleteVolunteerFromRequest(oldVolunteerRequest1.id, volunteer1.id)
      ).to.be.rejectedWith(CannotPerformOperationError);
    });

    it('throws error when trying to delete mapping to not found request', async function() {
      await expect(volunteerRequestRepository.deleteVolunteerFromRequest(453453, volunteer1.id)).to.be.rejectedWith(
        NotFoundError
      );
    });

    it('throws error when trying to delete mapping that doesnt exist', async function() {
      await expect(
        volunteerRequestRepository.deleteVolunteerFromRequest(volunteerRequest1.id, volunteer3.id)
      ).to.be.rejectedWith(NotFoundError);
    });
  });

  this.afterEach(function() {
    sandbox.restore();
  });

  this.afterAll(async function() {
    await removeSeed();
    appDataSource.destroy();
  });
});

require('dotenv/config');
import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import logger from '../src/logger';
import { seed } from './seed';
import {
  city1,
  company1,
  company2,
  institution1,
  location1,
  program1,
  programManager1,
  volunteer1,
  volunteer2,
  volunteerRequest1,
  volunteerRequest1ToVolunteer1,
  volunteerRequest1ToVolunteer2
} from './mock';

describe('app', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  beforeEach(async function() {
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
      users: [volunteer1, volunteer2, programManager1],
      volunteerRequests: [volunteerRequest1],
      volunteerRequestToVolunteers: [volunteerRequest1ToVolunteer1, volunteerRequest1ToVolunteer2]
    });
  });

  it('test', function() {
    console.log('test completed');
  });

  afterEach(function() {
    sandbox.restore();
  });
});

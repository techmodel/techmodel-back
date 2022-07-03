require('dotenv/config');
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
  program1,
  programManager1,
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
import { volunteerRequestRepository } from '../src/repos';
import { VolunteerRequest } from '../src/models';

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
      users: [volunteer1, volunteer2, programManager1],
      volunteerRequests: [volunteerRequest1],
      volunteerRequestToVolunteers: [volunteerRequest1ToVolunteer1, volunteerRequest1ToVolunteer2],
      skills: [skill1, skill2],
      skillToVolunteerRequests: [skill1ToVolunteerRequest1, skill2ToVolunteerRequest1]
    });
  });

  it.skip('test', async function() {
    const res = await volunteerRequestRepository.find({ relations: { skillToVolunteerRequest: { skill: true } } });
    console.log(res);
    console.log(res[0].skillToVolunteerRequest);
  });

  it('test', async function() {
    const res = await volunteerRequestRepository
      .createQueryBuilder('vr')
      .loadRelationCountAndMap('vr.currentVolunteers', 'vr.volunteerRequestToVolunteer')
      .leftJoinAndSelect('vr.skillToVolunteerRequest', 'stvr')
      .leftJoinAndSelect('stvr.skill', 'skill')
      .where('vr.id = :vrId', { vrId: volunteerRequest1.id })
      .andWhere('vr.startDate > :currentDate', { currentDate: new Date().toISOString() })
      .andWhere(qb => {
        const subQuery = qb
          .subQuery()
          .select('vr.id')
          .from(VolunteerRequest, 'vr')
          .leftJoin('vr.volunteerRequestToVolunteer', 'vrtv')
          // join users and recipies
          .groupBy('vr.id, vr.totalVolunteers')
          .having('COUNT(*) < vr.totalVolunteers')
          .getQuery();
        return 'vr.id IN ' + subQuery;
      })
      .getMany();
    console.log(res);
    console.log(res[0].skillToVolunteerRequest);
  });

  this.afterEach(function() {
    sandbox.restore();
  });

  this.afterAll(async function() {
    await removeSeed();
    appDataSource.destroy();
  });
});

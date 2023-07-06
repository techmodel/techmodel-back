import { expect } from 'chai';
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { city1, createInstitutionDTO1, institution1, location1 } from './mock';
import app from '../src/server/server';
import { institutionRepository } from '../src/repos';
import { programManager1Jwt, volunteer1Jwt, programCoordinator1Jwt } from './setup';

describe('institutions', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      cities: [city1],
      locations: [location1],
      institutions: [institution1]
    });
  });

  it('returns list of institutions', async function() {
    const res = await request(app).get(`/api/v1/institutions`);
    expect(res.body).to.eql([{ ...institution1, createdAt: institution1.createdAt.toISOString() }]);
  });

  describe('create institution', () => {
    it('creates an institution successfully if payload is valid', async function() {
      let targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
      const res = await request(app)
        .post(`/api/v1/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send(createInstitutionDTO1);
      expect(res.status).to.eq(200);
      targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution?.name).to.eq(createInstitutionDTO1.name);
    });

    it('returns 422 if one of the properties is no valid', async function() {
      let targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
      const res = await request(app)
        .post(`/api/v1/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ ...createInstitutionDTO1, name: undefined, nam: createInstitutionDTO1.name }); // change `name` to `nam`
      expect(res.status).to.eq(422);
      targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
    });

    it('returns 422 if institution type doesnt exist', async function() {
      let targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
      const res = await request(app)
        .post(`/api/v1/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ ...createInstitutionDTO1, institutionType: 'something' });
      expect(res.status).to.eq(422);
      targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
    });

    it('returns 422 if population type doesnt exist', async function() {
      let targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
      const res = await request(app)
        .post(`/api/v1/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ ...createInstitutionDTO1, populationType: 'something1' });
      expect(res.status).to.eq(422);
      targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
    });

    it('returns 500 if city doesnt exist', async function() {
      let targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
      const res = await request(app)
        .post(`/api/v1/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ ...createInstitutionDTO1, cityId: 123 });
      expect(res.status).to.eq(500);
      targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
    });

    it('returns 403 non manager tries to create the institution', async function() {
      let targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
      let res = await request(app)
        .post(`/api/v1/institutions`)
        .set('Authorization', `Bearer ${volunteer1Jwt}`)
        .send(createInstitutionDTO1);
      expect(res.status).to.eq(403);
      targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
      res = await request(app)
        .post(`/api/v1/institutions`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send(createInstitutionDTO1);
      expect(res.status).to.eq(403);
      targetInstitution = await institutionRepository.findOne({ where: { name: createInstitutionDTO1.name } });
      expect(targetInstitution).to.eq(null);
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

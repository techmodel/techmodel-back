import { expect } from 'chai';
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import {
  institution1,
  institution2,
  program1,
  program1ToInstitution1,
  location1,
  city1,
  city2,
  program2
} from './mock';
import { HTTPError, programCoordinator1Jwt, programManager1Jwt } from './setup';
import app from '../src/server/server';

describe('programToInstitution', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      locations: [location1],
      cities: [city1, city2],
      programs: [program1],
      institutions: [institution1, institution2],
      programToInstitutions: [program1ToInstitution1]
    });
  });

  describe('query', () => {
    it('program manager can get related institutions', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.body).to.eql([institution1.id]);
    });

    it('program coordinator can get related institutions', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect(res.body).to.eql([institution1.id]);
    });

    it('program coordinator from different program cant get related institutions', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program2.id}/institutions`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('Trying to access another program data');
      expect(res.status).to.eq(403);
    });

    it('program coordinator from different program cant get related institutions', async function() {
      const res = await request(app)
        .get(`/api/v1/programs/${program2.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect((res.error as HTTPError).text).to.eq('Trying to access another program data');
      expect(res.status).to.eq(403);
    });
  });

  describe('add', () => {
    it('program manager can add related institution', async function() {
      let res = await request(app)
        .get(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.body).to.eql([institution1.id]);
      await request(app)
        .post(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ institutionId: institution2.id });
      res = await request(app)
        .get(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.body).to.eql([institution1.id, institution2.id]);
    });
    it('program manager cant add related institution to other program', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program2.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ institutionId: institution2.id });
      expect((res.error as HTTPError).text).to.eq('Trying to access another program data');
      expect(res.status).to.eq(403);
    });
    it('program coordinator cant add related institution', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send({ institutionId: institution2.id });
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });
    // TODO: better error handling
    it('adding institution that already exists results in error', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ institutionId: institution1.id });
      expect((res.error as HTTPError).text).to.eq('"Unknown Error"');
      expect(res.status).to.eq(500);
    });
  });

  describe('delete', () => {
    it('program manager can delete related institution', async function() {
      let res = await request(app)
        .get(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.body).to.eql([institution1.id]);
      await request(app)
        .delete(`/api/v1/programs/${program1.id}/institutions/${institution1.id}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      res = await request(app)
        .get(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`);
      expect(res.body).to.eql([]);
    });
    it('program coordinator cant delete related institution', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program1.id}/institutions`)
        .set('Authorization', `Bearer ${programCoordinator1Jwt}`)
        .send({ institutionId: institution2.id });
      expect((res.error as HTTPError).text).to.eq('You are not authorized to perform this action');
      expect(res.status).to.eq(403);
    });
    it('program manager cant delete related institution for other program', async function() {
      const res = await request(app)
        .post(`/api/v1/programs/${program2.id}/institutions`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
        .send({ institutionId: institution2.id });
      expect((res.error as HTTPError).text).to.eq('Trying to access another program data');
      expect(res.status).to.eq(403);
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

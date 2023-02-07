import { expect } from 'chai';
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { company1, company2 } from './mock';
import app from '../src/server/server';

describe('companies', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      companies: [company1, company2]
    });
  });

  describe('returns list of companies', function() {
    it('returns list of companies', async function() {
      const res = await request(app).get(`/api/v1/companies`);
      expect(res.body).to.eql([company1, company2]);
    });
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

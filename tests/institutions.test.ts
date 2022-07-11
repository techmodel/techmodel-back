import { expect } from 'chai';
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { city1, institution1, location1 } from './mock';
import app from '../src/server/server';

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

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

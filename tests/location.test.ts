import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server/server';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { location1 } from './mock';

describe('locations', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      locations: [location1]
    });
  });

  it('returns list of locations', async function() {
    const res = await request(app).get(`/api/v1/locations`);
    expect(res.body).to.eql([location1]);
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

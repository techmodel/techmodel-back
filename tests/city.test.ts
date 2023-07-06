import { expect } from 'chai';
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { city1, city2 } from './mock';
import app from '../src/server/server';

describe('cities', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      cities: [city1, city2]
    });
  });

  it('returns list of cities', async function() {
    const res = await request(app).get(`/api/v1/cities`);
    expect(res.body).to.eql([city1, city2]);
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

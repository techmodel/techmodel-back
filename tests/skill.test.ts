import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server/server';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { skill1, skill2 } from './mock';

describe('skills', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      skills: [skill1, skill2]
    });
  });

  it('returns list of skills', async function() {
    const res = await request(app).get(`/api/v1/skills`);
    expect(res.body).to.eql([skill1, skill2]);
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

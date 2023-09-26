import { expect } from 'chai';
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { feedback1 } from './mock';
import app from '../src/server/server';
import { programManager1Jwt } from './setup';

describe('feedback', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      feedback: [feedback1]
    });
  });

  it('returns list of feedbacks for specific request ID', async function() {
    const res = await request(app)
        .get(`/api/v1/feedback/${feedback1.volunteerRequestId}`)
        .set('Authorization', `Bearer ${programManager1Jwt}`)
    expect(res.body).to.eql([feedback1]);
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

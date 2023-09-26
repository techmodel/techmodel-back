import { expect } from 'chai';
import request from 'supertest';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { volunteer1, company1, feedback1 } from './mock';
import app from '../src/server/server';
import { expectedFeedback, programManager1Jwt } from './setup';

describe('feedback', function () {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function () {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      users: [volunteer1],
      companies: [company1],
      feedback: [feedback1]
    });
  });

  it('returns list of feedbacks for specific request', async function () {
    const res = await request(app)
      .get(`/api/v1/feedback/${feedback1.volunteerRequestId}`)
      .set('Authorization', `Bearer ${programManager1Jwt}`);
    expect(res.body).to.eql([expectedFeedback(feedback1, volunteer1)]);
  });

  this.afterEach(async function () {
    sandbox.restore();
    await removeSeed();
  });
});

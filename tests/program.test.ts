import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server/server';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { program1, program2 } from './mock';

describe('programs', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  this.beforeEach(async function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
    // seed db
    await seed({
      programs: [program1, program2]
    });
  });

  it('returns list of programs', async function() {
    const res = await request(app).get(`/api/v1/programs`);
    expect(res.body).to.eql([program1, program2]);
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

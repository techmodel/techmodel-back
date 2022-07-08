import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { city1, institution1, location1 } from './mock';
import { institutionRepository } from '../src/repos';

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
    const institutions = await institutionRepository.find();
    expect(institutions).to.eql([institution1]);
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

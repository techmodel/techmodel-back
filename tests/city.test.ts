import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import logger from '../src/logger';
import { removeSeed, seed } from './seed';
import { city1, city2 } from './mock';
import { cityRepository } from '../src/repos';

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
    const cities = await cityRepository.find();
    expect(cities).to.eql([city1, city2]);
  });

  this.afterEach(async function() {
    sandbox.restore();
    await removeSeed();
  });
});

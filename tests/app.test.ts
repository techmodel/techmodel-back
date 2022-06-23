require('dotenv/config');
import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import logger from '../src/logger';

describe('app', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
  });
  afterEach(function() {
    sandbox.restore();
  });
});

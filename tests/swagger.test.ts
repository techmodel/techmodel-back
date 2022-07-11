import logger from '../src/logger';
import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import request from 'supertest';
import app from '../src/server/server';

describe('api', function() {
  let sandbox: SinonSandbox = (null as unknown) as SinonSandbox;

  beforeEach(function() {
    sandbox = sinon.createSandbox();
    // disable logging
    sandbox.stub(logger);
  });
  afterEach(function() {
    sandbox.restore();
  });

  describe('/swagger', function() {
    it('should return OK status', async () => {
      const response = await request(app).get('/swagger');
      expect(response.status).to.be.oneOf([200, 301]);
    });
  });
});

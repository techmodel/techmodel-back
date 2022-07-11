require('dotenv/config');
import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import request from 'supertest';
import logger from '../src/logger';
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
    it('should return OK status', function() {
      return request(app)
        .get('/swagger')
        .then(function(response) {
          expect(response.status).to.be.oneOf([200, 301]);
        });
    });
  });
});

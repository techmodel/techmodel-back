require('dotenv/config');
import logger from '../src/logger';
import { Response } from 'superagent';
import sinon, { SinonSandbox } from 'sinon';
import { expect } from 'chai';
import request from 'supertest';
import app, { API_PREFIX_V1 } from '../src/server/server';
import * as core from 'express-serve-static-core';

function getToApp(app: core.Express, path: string): Promise<Response> {
  return request(app).get(`${API_PREFIX_V1}${path}`);
}

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

/**
 * Responsible for managing the swagger middleware.
 *
 * A great example proj - https://editor.swagger.io/#/
 */

import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUI from 'swagger-ui-express';
import { Router } from 'express';

const swaggerRouter = Router();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Techmodel Backend',
    version: '1.0.0'
  },
  basepath: '/'
};

const options = {
  swaggerDefinition: swaggerDefinition,
  apis: [__dirname + '/api/*.{js,ts}', __dirname + '/../api/*.{js,ts}', __dirname + '/api/swagger/*.{js,ts}']
};
const swaggerSpec = swaggerJSDoc(options);

swaggerRouter.get('/swagger.json', function(req, res) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.set('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

swaggerRouter.use('/', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));

export default swaggerRouter;

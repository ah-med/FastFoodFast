import express from 'express';
import bodyParser from 'body-parser';
import trimmer from 'trim-request-body';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import orders from './routes/orders';
import auth from './routes/auth';
import menu from './routes/menu';
import users from './routes/users';
import swaggerDocument from './docs/swagger.json';

const fastfoodApp = express();
const port = process.env.PORT || 9000;

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Hello World', // Title (required)
      version: '1.0.0', // Version (required)
    },
  },
  // Path to the API docs
  apis: ['./routes/example.js'],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJSDoc(options);

// serve static files
fastfoodApp.use(express.static('./public'));

// allow cross origin access
fastfoodApp.use(cors());

// parsing application/json
fastfoodApp.use(bodyParser.json());

// parsing application/xwww-
fastfoodApp.use(bodyParser.urlencoded({ extended: true }));

// Trim the parsed request body.
fastfoodApp.use(trimmer);

fastfoodApp.listen(port);

// Swagger route
fastfoodApp.use('/api-docs', swaggerUi.serve);
fastfoodApp.get('/api-docs', swaggerUi.setup(swaggerSpec));

// create version1 of api
fastfoodApp.use('/api/v1/orders', orders);
fastfoodApp.use('/api/v1/auth', auth);
fastfoodApp.use('/api/v1/menu', menu);
fastfoodApp.use('/api/v1/users', users);

fastfoodApp.use('*', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to edited FastFoodFast Application',
  });
});

export default fastfoodApp;

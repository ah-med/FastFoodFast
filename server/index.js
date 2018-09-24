import express from 'express';
import bodyParser from 'body-parser';
import trimmer from 'trim-request-body';

import orders from './routes/orders';
import auth from './routes/auth';
import menu from './routes/menu';

const fastfoodApp = express();
const port = process.env.PORT || 9000;

// parsing application/json
fastfoodApp.use(bodyParser.json());

// parsing application/xwww-
fastfoodApp.use(bodyParser.urlencoded({ extended: true }));

// Trim the parsed request body.
fastfoodApp.use(trimmer);

fastfoodApp.listen(port);

// create version1 of api
fastfoodApp.use('/api/v1/orders', orders);
fastfoodApp.use('/api/v1/auth', auth);
fastfoodApp.use('/api/v1/menu', menu);

fastfoodApp.use('*', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to edited FastFoodFast Application',
  });
});

export default fastfoodApp;

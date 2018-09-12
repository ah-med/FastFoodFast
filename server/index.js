import express from 'express';
import bodyParser from 'body-parser';
import trimmer from 'trim-request-body';

import index from './routes/index';

const fastfoodApp = express();
const port = process.env.PORT || 9000;

// parsing application/json
fastfoodApp.use(bodyParser.json());

// parsing application/xwww-
fastfoodApp.use(bodyParser.urlencoded({ extended: true }));

// Trim the parsed request body.
fastfoodApp.use(trimmer);

fastfoodApp.listen(port);

fastfoodApp.use('/', index);

fastfoodApp.use('*', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Welcome to edited FastFoodFast Application',
  });
});

export default fastfoodApp;

import express from 'express';
import bodyParser from 'body-parser';
import trimmer from 'trim-request-body';
import cors from 'cors';
import orders from './routes/orders';
import auth from './routes/auth';
import menu from './routes/menu';
import users from './routes/users';

const fastfoodApp = express();
const port = process.env.PORT || 9000;

// serve static files
fastfoodApp.use(express.static('./public'));
fastfoodApp.use('*', express.static('./public/notfound.html'));

// allow cross origin access
fastfoodApp.use(cors());

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
fastfoodApp.use('/api/v1/users', users);


export default fastfoodApp;

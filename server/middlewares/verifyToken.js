import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import errors from '../controllers/errors';

dotenv.config();

// Secret key
const secret = process.env.SECRET_KEY;

const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers.authorization;

  // check if bearer is undefined
  if (!bearerHeader) return errors.unauthorizedError(res);

  // get the token from header value
  const [, token] = bearerHeader.split(' ');

  jwt.verify(token, secret, (err, userData) => {
    if (err) {
      // Wrong token
      return errors.forbidden(res, err.message);
    }
    req.userData = userData;
    next();
  });
};


export default verifyToken;

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


dotenv.config();

const signToken = (data, expTime) => {
  // user user data to sign JWT with expiration time
  const token = jwt.sign(data, process.env.SECRET_KEY, { expiresIn: expTime });
  return token;
};

const assignLoginToken = (req, res, next) => {
  // get user data from req.locals
  const { userId, email, role } = req.userData;
  const token = signToken({ userId, email, role }, '6h');

  // add token to req.locals
  req.token = token;

  next();
};

export default assignLoginToken;

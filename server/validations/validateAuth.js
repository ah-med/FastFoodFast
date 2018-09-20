import Schema from './validationSchema';
import Validator from './validator';
import Errors from '../controllers/errors';

const { authSchema } = Schema;
const { validationError } = Errors;

const validateSignup = (req, res, next) => {
  const data = ['firstName', 'lastName', 'email', 'password'];
  const errors = Validator(data, req.body, authSchema);
  return (errors !== null) ? validationError(res, errors) : next();
};


export default { validateSignup };
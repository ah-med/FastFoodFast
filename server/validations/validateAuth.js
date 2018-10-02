import Schema from './validationSchema';
import Validator from './validator';

const { authSchema } = Schema;
const { getValidation } = Validator;

const validateSignup = (req, res, next) => getValidation(req, res, next, ['firstName', 'lastName', 'email', 'password'], authSchema);

const validateLogin = (req, res, next) => getValidation(req, res, next, ['email', 'password'], authSchema);

export default { validateSignup, validateLogin };

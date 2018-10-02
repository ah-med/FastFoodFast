import Joi from 'joi';
import Errors from '../controllers/errors';

const { validationError } = Errors;

const sendError = (req, res, next, errors) => ((errors !== null)
  ? validationError(res, errors) : next());

const validator = (data, obj, schema) => {
  const errObj = {};
  let isError = false;
  data.forEach((val) => {
    const { error } = Joi.validate({ val: obj[val] }, { val: schema[val] });
    if (error !== null) {
      isError = true;
      errObj[val] = error.details[0].message.replace('"val"', val);
    }
  });

  if (isError) {
    return errObj;
  }

  return null;
};

const getValidation = (req, res, next, fieldsArray, schema) => {
  const errors = validator(fieldsArray, req.body, schema);
  sendError(req, res, next, errors);
};

export default { validator, getValidation, sendError };

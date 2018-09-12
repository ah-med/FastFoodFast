import Schema from './validationSchema';
import Validator from './validator';
import Errors from '../controllers/errors';

const { placeOrderSchema } = Schema;
const { validationError } = Errors;

const validateOrder = (req, res, next) => {
  const data = ['name', 'phoneNo', 'address', 'foodItems'];
  const errors = Validator(data, req.body, placeOrderSchema);
  return (errors !== null) ? validationError(res, errors) : next();
};


export default { validateOrder };

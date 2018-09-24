import Schema from './validationSchema';
import Validator from './validator';
import Errors from '../controllers/errors';

const { placeOrderSchema, updateStatusSchema } = Schema;
const { validationError } = Errors;

const validateOrder = (req, res, next) => {
  const data = ['phoneNo', 'address', 'foodItems'];
  const errors = Validator(data, req.body, placeOrderSchema);
  return (errors !== null) ? validationError(res, errors) : next();
};

const validateOrderId = (req, res, next) => {
  const data = ['orderId'];
  const obj = {};
  obj.orderId = req.params.orderId;
  const errors = Validator(data, obj, updateStatusSchema);
  return (errors !== null) ? validationError(res, errors) : next();
};
const validateOrderStatus = (req, res, next) => {
  const data = ['status', 'orderId'];
  const obj = {};
  obj.status = req.body.status;
  obj.orderId = req.params.orderId;
  const errors = Validator(data, obj, updateStatusSchema);
  return (errors !== null) ? validationError(res, errors) : next();
};

export default { validateOrder, validateOrderId, validateOrderStatus };

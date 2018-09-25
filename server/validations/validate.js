import Schema from './validationSchema';
import Validator from './validator';
import Errors from '../controllers/errors';

const { placeOrderSchema, updateStatusSchema, idSchema } = Schema;
const { validationError } = Errors;

const validateId = (id) => {
  const data = ['id'];
  const obj = {};
  obj.id = id;
  const errors = Validator(data, obj, idSchema);
  return errors;
};

const validateOrder = (req, res, next) => {
  const data = ['phoneNo', 'address', 'foodItems'];
  const errors = Validator(data, req.body, placeOrderSchema);
  return (errors !== null) ? validationError(res, errors) : next();
};

const validateOrderId = (req, res, next) => {
  const errors = validateId(req.params.orderId);
  return (errors !== null) ? validationError(res, errors) : next();
};

const validateUserId = (req, res, next) => {
  const errors = validateId(req.params.userId);
  return (errors !== null) ? validationError(res, errors) : next();
};

const validateOrderStatus = (req, res, next) => {
  const data = ['status'];
  const obj = {};
  obj.status = req.body.status;
  obj.orderId = req.params.orderId;
  const errors = Validator(data, obj, updateStatusSchema);
  return (errors !== null) ? validationError(res, errors) : next();
};

export default {
  validateOrder, validateOrderId, validateOrderStatus, validateUserId
};

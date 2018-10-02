import Schema from './validationSchema';
import Validator from './validator';

const { placeOrderSchema, updateStatusSchema, idSchema } = Schema;
const { validator, getValidation, sendError } = Validator;

const validateId = (req, res, next, id) => {
  const data = ['id'];
  const obj = {};
  obj.id = id;
  const errors = validator(data, obj, idSchema);
  sendError(req, res, next, errors);
};

const validateOrder = (req, res, next) => getValidation(req, res, next, ['phoneNo', 'address', 'foodItems'], placeOrderSchema);

const validateOrderId = (req, res, next) => validateId(req, res, next, req.params.orderId);

const validateUserId = (req, res, next) => validateId(req, res, next, req.params.userId);


const validateOrderStatus = (req, res, next) => {
  const data = ['status'];
  const obj = {};
  obj.status = req.body.status;
  obj.orderId = req.params.orderId;
  const errors = validator(data, obj, updateStatusSchema);
  sendError(req, res, next, errors);
};

export default {
  validateOrder, validateOrderId, validateOrderStatus, validateUserId
};

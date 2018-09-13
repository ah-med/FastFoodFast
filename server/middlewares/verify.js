import ordersList from '../models/index';
import errors from '../controllers/errors';

const verifyOrderId = (req, res, next) => {
  // get the orderId
  const { orderId } = req.params;
  // check the Id
  const check = ordersList.find(val => val.orderId === orderId);
  if (!check) {
    // send error 404
    return errors.errorNotFound(res);
  }
  req.checkedOrder = check;
  next();
};

export default { verifyOrderId };

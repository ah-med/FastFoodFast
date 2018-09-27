import db from '../models/db';
import errors from '../controllers/errors';

const verifyOrderId = (req, res, next) => {
  // get the orderId
  const { orderId } = req.params;
  const query = 'select exists(select * from orders where order_id=$1)';
  db.query(query, [orderId], (err, data) => {
    if (!data.rows[0].exists) {
      return errors.errorNotFound(res, 'an order with the provided id does not exist');
    }
    next();
  });
};

export default { verifyOrderId };

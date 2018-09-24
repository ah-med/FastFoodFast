import db from '../models/db';
import errors from './errors';

/**
 * @class UserController
 */
class UserController {
  /**
        * fetch User order history
        *@param {object} req The request *.
        *@param {object} res The response *.
        *@returns {object} returns response *
        */
  static fetchOrders(req, res) {
    const { userId } = req.params;
    const text = 'select * from orders where user_id=$1';
    const param = [userId];
    db.query(text, param, (err, orders) => {
      if (err) return errors.serverError(res);
      const message = (orders.rows.length === 0) ? 'no order yet' : 'success';
      return res.status(200).json({
        message,
        data: orders.rows
      });
    });
  }
}

export default UserController;

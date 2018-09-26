import db from '../models/db';
import errors from './errors';
import ordersList from '../models/index';

/**
 * @class OrderController
 */
class OrderController {
  /**
    * Place an order
    *@param {object} req The request *.
    *@param {object} res The response *.
    *@returns {undefined} returns undefined *
    */
  static create(req, res) {
    const {
      phoneNo, address
    } = req.body;
    let { foodItems } = req.body;
    foodItems = (typeof foodItems === 'object') ? JSON.stringify(foodItems) : foodItems;
    const { userData, totalAmount, orderStatus } = req;
    const dateCreated = new Date().toDateString();
    const query = 'INSERT INTO orders(user_id, status, address, phone_number, date_created, last_updated, total_amount, order_items) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const parameters = [
      userData.userId,
      orderStatus,
      address,
      phoneNo,
      dateCreated,
      dateCreated,
      totalAmount,
      foodItems
    ];
    db.query(query, parameters, (err, data) => {
      if (err) return errors.serverError(res);
      res.status(201).json({
        status: 201,
        message: 'Order placed successfully!',
        data: data.rows
      });
    });
  }

  /**
    * Update the status of an order
    *@param {object} req The request *.
    *@param {object} res The response *.
    *@returns {undefined} returns undefined *
    */
  static updateStatus(req, res) {
    const { orderId } = req.params;
    const status = req.orderStatus;
    db.query('UPDATE orders SET status=$1 WHERE order_id=$2 RETURNING *', [status, orderId], (error, data) => {
      if (error) return errors.serverError(res);
      const returnData = data.rows[0];
      return res.status(200).json({
        message: 'order updated successfully',
        data: [
          returnData
        ]
      });
    });
  }

  /**
    * Get order
    *@param {object} req The request *.
    *@param {object} res The response *.
    *@returns {undefined} returns undefined *
    */
  static getOrder(req, res) {
    const { orderId } = req.params;
    const query = 'select * from orders where order_id=$1';
    db.query(query, [orderId], (err, data) => {
      if (err) return errors.serverError(res);
      res.status(200).json({
        status: 200,
        data: data.rows
      });
    });
  }

  /**
  * Get all orders
  *@param {object} req The request *.
  *@param {object} res The response *.
  *@returns {undefined} returns undefined *
  */
  static getAllOrders(req, res) {
    res.status(200).json({
      status: 200,
      data: ordersList
    });
  }
}

export default OrderController;

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

    // for each of the orders in the ordersList
    // look for the order with a matching orderId
    // assign the status of the order
    // send the whole order back as response to the user
    ordersList.forEach((val) => {
      if (val.orderId === orderId) {
        val.orderStatus = req.orderStatus;
        return res.status(200).json({
          status: 200,
          message: 'Order update successful',
          data: [
            val
          ]
        });
      }
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
    const order = ordersList.find(val => val.orderId === orderId);
    res.status(200).json({
      status: 200,
      data: [order]
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

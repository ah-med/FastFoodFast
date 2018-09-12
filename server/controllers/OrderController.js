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
    // get user data
    const {
      name, phoneNo, address, foodItems,
    } = req.body;

    // create order Id
    const orderId = ordersList.length + 1;

    // get date
    const dateCreated = new Date().toString();

    // create new order
    const order = {
      orderId,
      name,
      phoneNo,
      address,
      foodItems,
      dateCreated,
      lastModified: null,
    };

    // add new order to the list of orders
    ordersList.push(order);

    // send response
    res.status(201).json({
      status: 201,
      message: 'Order placed successfully!',
      data: [
        ordersList[ordersList.length - 1],
      ],
    });
  }
}

export default OrderController;

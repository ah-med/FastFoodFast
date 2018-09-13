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
    const orderId = `${ordersList.length + 1}`;

    // get date
    const dateCreated = new Date().toString();

    // create new order
    const order = {
      orderId,
      name,
      phoneNo,
      address,
      foodItems,
      orderStatus: req.orderStatus,
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
}

export default OrderController;

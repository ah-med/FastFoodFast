import db from '../models/db';
import errors from '../controllers/errors';

const newOrder = (req, res, next) => {
  req.orderStatus = 'New';
  next();
};

const processUpdate = (prevStatus, newStatus) => {
  let errorMessage;
  let orderStatus;
  switch (prevStatus) {
    case 'New':
      // you can only Process or Cancel an order that is New
      errorMessage = (newStatus === 'Complete') ? 'you can only Process/Cancel an order that is New' : undefined;
      orderStatus = (newStatus === 'Process') ? 'Processing' : 'Cancelled';
      break;
    case 'Completed':
      //  you cannot update a completed order
      errorMessage = 'you cannot update a completed order';
      break;
    case 'Processing':
      // you can only Cancel or Complete a Processing order status
      errorMessage = (newStatus === 'Process') ? 'you can only Complete/Cancel a Processing order' : undefined;
      orderStatus = (newStatus === 'Complete') ? 'Completed' : 'Cancelled';
      break;
    case 'Cancelled':
      //  you cannot update a Cancelled order
      errorMessage = 'you cannot update a Cancelled order';
      break;
    default:
      //  this should not be happening
      errorMessage = 'This should not be happening';
      break;
  }
  return { errorMessage, orderStatus };
};

const update = (req, res, next) => {
  // get the status from req.body
  const { status } = req.body;
  const { orderId } = req.params;
  const query = 'select status from orders where order_id=$1';
  db.query(query, [orderId], (err, data) => {
    if (err) return errors.serverError(res);
    const previousStatus = data.rows[0].status;
    const processStatus = processUpdate(previousStatus, status);
    const { errorMessage, orderStatus } = processStatus;
    req.orderStatus = orderStatus;
    if (errorMessage) {
      return errors.badRequestError(res, errorMessage);
    }
    req.orderStatus = orderStatus;
    next();
  });
};

export default { newOrder, update };

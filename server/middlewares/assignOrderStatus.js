import ordersList from '../models/index';
import errors from '../controllers/errors';

const newOrder = (req, res, next) => {
  req.orderStatus = 'Pending Approval';
  next();
};

const update = (req, res, next) => {
  // get the status from req.body
  const { status } = req.body;
  // get the order
  const order = ordersList.find(val => val.orderId === req.params.orderId);
  let errMess;
  let orderStatus;
  switch (order.orderStatus) {
    case 'Pending Approval':
      // you can only Accept or Decline an order that is Pending Approval
      if (status === 'Accept' || status === 'Decline') {
        orderStatus = (status === 'Accept') ? 'Accepted' : 'Declined';
      } else {
        errMess = 'You can only Accept/Decline an order that is Pending Approval';
      }
      break;
    case 'Completed':
      //  you cannot update a completed order
      errMess = 'you cannot update a completed order';
      break;
    case 'Accepted':
      // you can only Decline or Complete an accepted order
      if (status === 'Complete' || status === 'Decline') {
        orderStatus = (status === 'Complete') ? 'Completed' : 'Declined';
        break;
      }
      errMess = 'you can only Complete/Decline an Approved order';
      break;
    case 'Declined':
      //  you cannot update a declined order
      errMess = 'you cannot update a declined order';
      break;
    default:
      //  this should not be happening
      errMess = 'This should not be happening';
      break;
  }
  req.orderStatus = orderStatus;
  return (errMess) ? errors.forbidden(res, errMess) : next();
};

export default { newOrder, update };

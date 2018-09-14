import ordersList from '../models/index';
import errors from '../controllers/errors';

const newOrder = (req, res, next) => {
  req.orderStatus = 'Pending Approval';
  next();
};

const processUpdate = (prevStatus, newStatus) => {
  let errMess;
  let orderStatus;
  switch (prevStatus) {
    case 'Pending Approval':
      // you can only Accept or Decline an order that is Pending Approval
      if (newStatus === 'Accept' || newStatus === 'Decline') {
        orderStatus = (newStatus === 'Accept') ? 'Accepted' : 'Declined';
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
      if (newStatus === 'Complete' || newStatus === 'Decline') {
        orderStatus = (newStatus === 'Complete') ? 'Completed' : 'Declined';
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
  return { errMess, orderStatus };
};

const update = (req, res, next) => {
  // get the status from req.body
  const { status } = req.body;
  // get the order
  const order = ordersList.find(val => val.orderId === req.params.orderId);
  // process the update
  const processStatus = processUpdate(order.orderStatus, status);
  const { errMess, orderStatus } = processStatus;
  req.orderStatus = orderStatus;
  if (errMess) {
    return errors.forbidden(res, errMess);
  }
  req.orderStatus = orderStatus;
  next();
};

export default { newOrder, update };

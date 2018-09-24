import express from 'express';
import validate from '../validations/validate';
<<<<<<< HEAD
import verify from '../middlewares/verify';
=======
>>>>>>> feat(order) - place an order for food
import verifyFoodItem from '../middlewares/verifyFoodItem';
import verifyToken from '../middlewares/verifyToken';
import getTotalAmount from '../middlewares/getTotalAmount';
import verifyRole from '../middlewares/verifyRole';
import assignOrderStatus from '../middlewares/assignOrderStatus';
import OrderController from '../controllers/OrderController';

const router = express.Router();

<<<<<<< HEAD
const { validateOrder, validateOrderId, validateOrderStatus } = validate;
const { verifyOrderId } = verify;
=======
const { validateOrder } = validate;
>>>>>>> feat(order) - place an order for food


// place an order
router.post('/', verifyToken, verifyRole.user, validateOrder, verifyFoodItem, assignOrderStatus.newOrder, getTotalAmount, OrderController.create);

<<<<<<< HEAD
// Get a specific order
router.get('/:orderId', verifyToken, verifyRole.admin, validateOrderId, verifyOrderId, OrderController.getOrder);

//  Get all orders
router.get('/', verifyToken, verifyRole.admin, OrderController.getAllOrders);

// update order
router.put('/:orderId', verifyToken, verifyRole.admin, validateOrderStatus, validateOrderId, verifyOrderId, assignOrderStatus.update, OrderController.updateStatus);

=======
>>>>>>> feat(order) - place an order for food

export default router;

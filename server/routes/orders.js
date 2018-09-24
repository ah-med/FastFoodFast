import express from 'express';
import validate from '../validations/validate';
import verify from '../middlewares/verify';
import verifyFoodItem from '../middlewares/verifyFoodItem';
import verifyToken from '../middlewares/verifyToken';
import getTotalAmount from '../middlewares/getTotalAmount';
import verifyRole from '../middlewares/verifyRole';
import assignOrderStatus from '../middlewares/assignOrderStatus';
import OrderController from '../controllers/OrderController';

const router = express.Router();

const { validateOrder, validateOrderId, validateOrderStatus } = validate;
const { verifyOrderId } = verify;


// place an order
router.post('/', verifyToken, verifyRole.user, validateOrder, verifyFoodItem, assignOrderStatus.newOrder, getTotalAmount, OrderController.create);

// update order
router.put('/:orderId', verifyToken, verifyRole.admin, validateOrderStatus, validateOrderId, verifyOrderId, assignOrderStatus.update, OrderController.updateStatus);


export default router;

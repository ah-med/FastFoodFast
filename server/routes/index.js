import express from 'express';
import validate from '../validations/validate';
import verify from '../middlewares/verify';
import assignOrderStatus from '../middlewares/assignOrderStatus';
import OrderController from '../controllers/OrderController';

const router = express.Router();

const { validateOrder, validateOrderId, validateOrderStatus } = validate;
const { verifyOrderId } = verify;

// Get an order
router.get('/orders/:orderId', validateOrderId, verifyOrderId, OrderController.getOrder);

//  Get all orders
router.get('/orders', OrderController.getAllOrders);

// place an order
router.post('/orders', validateOrder, assignOrderStatus.newOrder, OrderController.create);

// update order
router.put('/orders/:orderId', validateOrderStatus, verifyOrderId, assignOrderStatus.update, OrderController.updateStatus);

export default router;

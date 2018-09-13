import express from 'express';
import validate from '../validations/validate';
import verify from '../middlewares/verify';
import assignOrderStatus from '../middlewares/assignOrderStatus';
import OrderController from '../controllers/OrderController';

const router = express.Router();

const { validateOrder, validateOrderId, validateOrderStatus } = validate;
const { verifyOrderId } = verify;

// place an order
router.post('/orders', validateOrder, assignOrderStatus.newOrder, OrderController.create);

// update order
router.put('/orders/:orderId', validateOrderId, validateOrderStatus, verifyOrderId, assignOrderStatus.update, OrderController.updateStatus);

export default router;

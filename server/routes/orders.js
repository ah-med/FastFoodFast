import express from 'express';
import validate from '../validations/validate';
import verifyFoodItem from '../middlewares/verifyFoodItem';
import verifyToken from '../middlewares/verifyToken';
import getTotalAmount from '../middlewares/getTotalAmount';
import verifyRole from '../middlewares/verifyRole';
import assignOrderStatus from '../middlewares/assignOrderStatus';
import OrderController from '../controllers/OrderController';

const router = express.Router();

const { validateOrder } = validate;


// place an order
router.post('/', verifyToken, verifyRole.user, validateOrder, verifyFoodItem, assignOrderStatus.newOrder, getTotalAmount, OrderController.create);


export default router;

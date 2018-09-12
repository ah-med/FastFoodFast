import express from 'express';
import validate from '../validations/validate';
import OrderController from '../controllers/OrderController';

const router = express.Router();

const { validateOrder } = validate;

router.post('/orders', validateOrder, OrderController.create);


export default router;

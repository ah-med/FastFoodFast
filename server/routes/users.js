import express from 'express';
import validate from '../validations/validate';
import verifyToken from '../middlewares/verifyToken';
import verifyRole from '../middlewares/verifyRole';
import verifyUserId from '../middlewares/verifyUserId';
import UserController from '../controllers/UserController';


const router = express.Router();

const { validateUserId } = validate;

// Get a specific order
router.get('/:userId/orders', verifyToken, verifyRole.user, validateUserId, verifyUserId, UserController.fetchOrders);

export default router;

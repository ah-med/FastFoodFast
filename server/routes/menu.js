import express from 'express';
import validateMeal from '../validations/validateMeal';
import verifyToken from '../middlewares/verifyToken';
import verifyRole from '../middlewares/verifyRole';
import MenuController from '../controllers/MenuController';
import checkExistingMeal from '../middlewares/checkExistingMeal';


const router = express.Router();

// Add a meal option to the menu
router.post('/', verifyToken, verifyRole.admin, validateMeal, checkExistingMeal, MenuController.addMeal);

export default router;

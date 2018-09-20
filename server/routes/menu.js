import express from 'express';
import validateMeal from '../validations/validateMeal';
import verifyToken from '../middlewares/verifyToken';
import verifyRole from '../middlewares/verifyRole';
import MenuController from '../controllers/MenuController';


const router = express.Router();


/**
*   verifyToken

    verifyRole.admin

    ValidateMeal

    MenuController.addMeal
 * * */

// Add a meal option to the menu
router.post('/', verifyToken, verifyRole.admin, validateMeal, MenuController.addMeal);

// Get available menu
router.get('/', verifyToken, verifyRole.admin /*, MenuController.fetchMenu */);

export default router;

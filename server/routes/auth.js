import express from 'express';
import validateAuth from '../validations/validateAuth';
import AuthController from '../controllers/AuthController';
import checkExistingAccount from '../middlewares/checkExistingAccount';


const { validateSignup } = validateAuth;
const router = express.Router();


// Register a user
router.post('/signup', validateSignup, checkExistingAccount, AuthController.signUp);

export default router;

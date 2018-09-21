import express from 'express';
import validateAuth from '../validations/validateAuth';
import AuthController from '../controllers/AuthController';
import checkExistingAccount from '../middlewares/checkExistingAccount';
import fetchUserData from '../middlewares/fetchUserData';
import verifyUserCredentials from '../middlewares/verifyUserCredentials';
import assignLoginToken from '../middlewares/assignLoginToken';


const { validateSignup, validateLogin } = validateAuth;
const router = express.Router();


// Register a user
router.post('/signup', validateSignup, checkExistingAccount, AuthController.signUp);

// Login a user
router.post('/login', validateLogin, fetchUserData, verifyUserCredentials, assignLoginToken, AuthController.login);

export default router;

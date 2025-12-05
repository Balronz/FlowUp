import Router from 'express';
import { registerUser, loginUser, logoutUser, updateUser } from '../controllers/authController.js';
import { registerValidationRules, loginValidationRules, updateValidationRules } from '../validations/authValidation.js';
import validate from '../middleware/validationMiddleware.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
router.post('/register'
    ,registerValidationRules //Validation rules for register
    , validate //Error handler
    ,registerUser);

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login'
    , loginValidationRules //Validation rules for login
    , validate //Error handler
    ,loginUser);

/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access public
 */
router.post('/logout', logoutUser);

/**
 * @desc Update user data
 * @route PATCH /api/auth/update
 * @access private
 */
router.patch('/update'
    , protect
    , updateValidationRules //Validation rules for update
    , validate //Error handler
    , updateUser);


export default router;
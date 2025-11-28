import Router from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const router = Router();

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */

router.post('/register', registerUser);
/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
router.post('/login', loginUser);
/**
 * @desc Logout user
 * @route POST /api/auth/logout
 * @access public
 */
router.post('/logout', logoutUser);
export default router;
import Router from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

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

export default router;
import * as authService from '../service/authService.js';
import createServiceError from '../utils/createServiceError.js'

/**
 * Function to safely send Token
 * @params token and res from express
 */
const sendTokenResponse = (token, res) => {
    const options = {
        expires: new Date(Date.now() + process.env.JWT_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true, //Cooke not accesible from javascript
        secure: process.env.NODE_ENV === 'production', 
    };
    res.cookie('token', token, options).status(200).json({success: true, token});
};

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async(req, res, next) => {
    const userData = req.body;
    try{
        const token = await authService.registerUser(userData);
        sendTokenResponse(token, res);
    }catch(err) {
        next(err);
    }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access public
 */

const loginUser = async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        if(!email || !password){
            throw createServiceError('Please provide email and password', 400);
        }
        const token = await authService.loginUser(email, password);
        sendTokenResponse(token, res);
    }catch(err){
        next(err);
    }
};

export {registerUser, loginUser};
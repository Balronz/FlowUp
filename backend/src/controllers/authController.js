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
 * @desc allows to register
 * @route   POST /api/auth/register
 * @access  public
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
 * @desc allows to login
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

/**
 * Logout user
 * @desc allows to logout as user
 * @route POST /api/auth/logout
 * @access private
 */
const logoutUser = async(req, res, next) => {
    try{
        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true,
        })
        res.status(200).json({
            success: true,
            data: 'Logout, success.'
        });

    } catch(err){
        next(err);
    }

};

/**
 * Update user data
 * @desc allows to update user info(email, password, name...)
 * @route PATCH /api/auth/update
 * @access private
 */
const updateUser = async(req, res, next) => {
    try{
        //Obtain id from user token
        const userId = await req.user.id;
        //Obtain the data to update from petition
        const updateData = await req.body;
        //Call function to update data
        const updatedUser = await authService.updateUserData(userId, updateData);
        //Return response with updated data
        return res.status(200).json({
            success: true,
            message: 'User updated succesfully',
            data: updatedUser
        });
    }catch(err){
        next(err);
    }
};

export {registerUser, loginUser, logoutUser, updateUser};
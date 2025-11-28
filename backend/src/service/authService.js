import User from "../models/User.js";
import createServiceError from "../utils/createServiceError.js";

//Function to register
const registerUser = async(userData) => {
    try {
        //Creates user(hashed password) and generates token through method and id
        const newUser = await User.create(userData);
        const token =  newUser.getSignedJwtToken();
        return token;
    } catch(err) {
        //Error handler. Throws error instead of return
        if(err.code === 11000) {
            throw createServiceError('User already exists', 400);
        } else {
            throw err;
        }
    }
};


//Function login
const loginUser = async(email, password) => {
    try{
        const user = await User.findOne({email}).select('+password');
        if(!user) {
            throw createServiceError('Invalid credentials', 401);
        } 
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            throw createServiceError('Invalid credentials', 401);
        }
        const token = user.getSignedJwtToken();
        return token;
    } catch(err) {
        if(err.code === 11000) {
            throw createServiceError('User already exists', 400);
        } else {
            throw err;
        }
    }
};

export { registerUser, loginUser };
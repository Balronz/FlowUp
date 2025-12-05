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

//Function to update users data
const updateUserData = async(userId, updateData) => {
    try{
        const foundUser = await User.findById(userId);
        if(!foundUser) {
            throw  createServiceError('User not found', 404);
        }
        const allowedFields = ['userName', 'email', 'password'];
        for(const key of Object.keys(updateData)){
            if(!allowedFields.includes(key)){
                throw createServiceError('Invalid field', 400);
            }
            //Verify if email exists
            if(key === 'email'){
                const emailExists = await User.findOne({email: updateData[key]});
                if(emailExists != null && emailExists._id.toString() != userId){
                    throw createServiceError('Email already exists', 400);
                }
            }
            //Assign, save and return updated data
            foundUser[key] = updateData[key];
        }
        //Converts to object, deletes hash and returns clean object
        await foundUser.save();
        const userObject = foundUser.toObject();
        delete userObject.password;
        return userObject;
    } catch(err){
        if(err.code === 11000) {
            throw createServiceError('User already exists', 400);
        } else {
            throw err;
        }
    }
};

export { registerUser, loginUser, updateUserData };
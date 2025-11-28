import jwt from "jsonwebtoken";
import User from "../models/User.js";
import createServiceError from "../utils/createServiceError.js";



const protect = async(req, res, next) => {
    let token;
    //Checks cookie in HTTP-only
    if(req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    //Search token in header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    }
    //Verify existence
    if(!token) {
        return next(createServiceError('Not authorized to access this route', 401));
    }

    try{
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) {
            return next(createServiceError('Not authorized to access this route', 401));
        }
        req.user = user;
        next();
    }catch(err){
        next(err);
    }
};

export default protect;
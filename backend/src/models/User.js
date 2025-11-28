import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [4, 'Username must be at least 4 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please enter a valid email address'
        ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        trim: true,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

//Method to hash password
userSchema.pre('save', async function(next){
    try {
        if(!this.isModified('password')) return next();
    
        if(this.password.length < 6){
            return next(new Error('Password must be at least 6 characters long'));
        } else {
            const saltRounds = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, saltRounds);
            next();
        }
    } catch (err) {
        next(err);
    }
});

//Method to generate token for each id
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

//Metho to compare password during login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("user", userSchema);
export default User;

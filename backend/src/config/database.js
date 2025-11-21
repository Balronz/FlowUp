import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

//DB variables
//const MONGO_URI = process.env.MONGO_URI;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;
const URI = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;


const connectDB = async () => {
    
    if (!DB_USER || !DB_PASSWORD || !DB_NAME || !DB_HOST || !DB_PORT) {
        console.error("❌ Error: Missing environment variables");
        process.exit(1);
    }


    try {
        await mongoose.connect(URI);
        console.log('✅ DB connection successful');
    } catch(err) {
        console.error(err, '❌ DB connection error');
        process.exit(1); //Close app if DB connection fails
    }
};

//Export the funccion
export default connectDB;

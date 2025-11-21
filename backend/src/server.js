import app from './app.js'; //Import app to use express
import dotenv from 'dotenv'; //Import dotenv for environment variables
import connectDB from './config/database.js'; //Import connectDB

//Load environment variables
dotenv.config();

//Connect to server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

//Funtion to start server
const startServer = async () => {
    try {
        //Firt, connect DB
        await connectDB();
        //Second, initialize server
        app.listen(PORT, HOST, (error) => {
            if(error) {
                //Handle error if port is already in use
                console.error('❌ Server error');
                process.exit(1);
            }
            
            console.log(`Server FlowUp running on http://${HOST}:${PORT}`);
            console.log(`🌐 Enviroment: ${process.env.NODE_ENV || 'development'}`);
        });

    } catch (err) {
        //Error handling if DB connection fails or process fails
        console.error(err, '❌ Server error');
        process.exit(1);
    } 
};

//Start server
startServer();

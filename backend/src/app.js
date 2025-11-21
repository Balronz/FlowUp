import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

//Inicializamos express
const app = express();
const port = process.env.PORT || 3000;


app.listen(port, (error) => {
    if(error) {
        console.log(`Error starting the server: ${error}`);
        return;
    }


    console.log(`Server running on port ${port}`);
});

//TODO: errorHandling middleware
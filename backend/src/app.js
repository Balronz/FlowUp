import express from 'express';


//Initialize express and port
const app = express();
const port = process.env.PORT || 3000;

//Test route
app.get('/',(req, res) => {
    res.status(200).send("Wellcome to FlowUp");
});

//Routes
//TODO: add routes

//Middelewares
//TODO: errorHandling middleware
//TODO: cors and express.json middleware

export default app;
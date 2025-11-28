//Global error handler

const errorHandler = (err, req, res, next) => {
    let error = {... err}; //Create a copy of error object
    error.message = err.message; //Get message from error object

    let statusCode = err.statusCode || 500; //Get status code from error object or default to 500

    //Specific error handler
    if(err.name === 'CastError') { //Invalid id
        const message = 'Resource not foud';
        statusCode = 404;
        error = {...err, message: message};
    }
    if(err.message === 'ValidationError'){ //Missing required field
        const message = Object.values(err.errors).map(val => val.message);
        statusCode = 400;
        error = {...err, message: message.join(' ')};
    }
    if(err.code === 11000) {//Trying to create duplicate field like email
        const message = 'Duplicate field value entered';
        statusCode = 400;
        error = {...err, message: message};
    }
    //JSON response
    res.status(statusCode).json({
        success: false,
        message: error.message || 'Server Error',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });

};

export default errorHandler;
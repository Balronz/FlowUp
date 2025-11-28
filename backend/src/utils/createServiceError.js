
//Error handling function
const createServiceError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode; 
    return error;
};

export default createServiceError;
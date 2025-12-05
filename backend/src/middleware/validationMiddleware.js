import { validationResult } from "express-validator";
import createServiceError from "../utils/createServiceError"; 

const validate = (req, res, next) => {
    const error = validationResult(req);
    if(error.isEmpty()){
        return next();
    }
    const firstError = error.array[0].msg;
    const validationError = createServiceError(
        `Validation failed: ${firstError}`, 400
    );
    next(validationError);
};

export default validate;
import { ExpressValidator, validationResult } from 'express-validator';

const validateTask = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            message: "Datos de tarea inválidos",
            errors: errors.array() 
        });
    }
    next();
};

export default validateTask;
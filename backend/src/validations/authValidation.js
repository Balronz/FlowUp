import { check } from 'express-validator';

//Rules to valudate register
const registerValidationRules = [ 
    check('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Email is invalid'),
    check('password').notEmpty().withMessage('Password is required').bail().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('userName').notEmpty().withMessage('User name is required').bail()
];

//Rules to validate login
const loginValidationRules = [
    check('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Email is invalid'),
    check('password').notEmpty().withMessage('Password is required').bail().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

//Rules to update data
const updateValidationRules = [
    check('email').optional().isEmail().withMessage('Email is invalid'),
    check('userName').optional().isLength({ min: 3 }).withMessage('User name must be at least 3 characters long')
];

export { registerValidationRules, loginValidationRules, updateValidationRules};

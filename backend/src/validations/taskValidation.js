import { check } from 'express-validator';

const createTaskValidationRules = [
    check('title').notEmpty().withMessage('Title is required').bail().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    check('description').optional().isLength({ max: 500 }).withMessage('Description must be at most 500 characters long'),
    check('status').optional().isIn(['Pending', 'In progress', 'Completed', 'Cancelled']).withMessage('Status must be one of the following: Pending, In progress, Completed, Cancelled')
];

const updateTaskValidationRules = [
    check('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    check('description').optional().isLength({ max: 500 }).withMessage('Description must be at most 500 characters long'),
    check('status').optional().isIn(['Pending', 'In progress', 'Completed', 'Cancelled']).withMessage('Status must be one of the following: Pending, In progress, Completed, Cancelled')
];

export { createTaskValidationRules, updateTaskValidationRules };
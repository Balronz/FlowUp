import Router from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';
import { createTaskValidationRules, updateTaskValidationRules } from '../validations/taskValidation.js';
import validate from '../middleware/validationMiddleware.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();


/**
 * @desc    Creates new task
 * @route   POST /api/tasks
 * @access  private (require JWT)
 */
router.post('/'
    , protect
    , createTaskValidationRules
    , validate
    , createTask);

/**
 * @desc    Gets All tasks
 * @route   GET /api/tasks
 * @access  private
 */
router.get('/', protect, getAllTasks);

/**
 * @desc    Gets one task by Id
 * @route   GET /api/tasks/:id
 * @access  private
 */
router.get('/:id', protect, getTaskById);

/**
 * @desc    Updates task by Id
 * @route   PUT /api/tasks/:id
 * @access  private
 */
router.put('/:id'
    , protect
    , updateTaskValidationRules
    , validate
    , updateTask);

/**
 * @desc    Deletes Task by Id
 * @route   DELETE /api/tasks/:id
 * @access  private
 */
router.delete('/:id', protect, deleteTask);

export default router;

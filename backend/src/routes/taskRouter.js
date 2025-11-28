import Router from 'express';
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask } from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';

const router = Router();


/**
 * @desc    Creates new task
 * @route   POST /api/tasks
 * @access  Private (require JWT)
 */
router.post('/', protect, createTask);

/**
 * @desc    Gets All tasks
 * @route   GET /api/tasks
 * @access  Private
 */
router.get('/', protect, getAllTasks);

/**
 * @desc    Gets one task by Id
 * @route   GET /api/tasks/:id
 * @access  Private
 */
router.get('/:id', protect, getTaskById);

/**
 * @desc    Updates task by Id
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
router.put('/:id', protect, updateTask);
 
/**
 * @desc    Deletes Task by Id
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
router.delete('/:id', protect, deleteTask);
 
export default router;

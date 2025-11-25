import * as taskService from'../service/taskService.js';

/**
 * @desc    Creates new task
 * @route   POST /api/tasks
 * @access  Private (require JWT)
 */
const createTask = async (req, res, next) => {
    try {
        const newTask = await taskService.createTask(req.body, req.user.id);
        res.status(201).json({data: newTask});
    } catch(err) {
        next(err);
    }
}

/**
 * @desc    Gets All tasks
 * @route   GET /api/tasks
 * @access  Private
 */
const getAllTasks = async(req, res, next) => {
    try{
        const tasks = await taskService.getAllTasks(req.user.id);
        res.status(200).json({data: tasks});
    }catch (err) {
        next(err);
    }
};

/**
 * @desc    Gets one task by Id
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async(req, res, next) => {
    try{
        const task =await taskService.getTaskById(req.params.id, req.user.id);
        res.status(200).json({data: task});
    }catch(err) {
        next(err);
    }
};

/**
 * @desc    Updates task by Id
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async(req, res, next) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.id, req.user.id, req.body);
        res.status(200).json({data: updatedTask});
    } catch(err) {
        next(err);
    }
};

/**
 * @desc    Deletes Task by Id
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async(req, res, next) => {
    try {
        await taskService.deleteTask(req.params.id, req.user.id);
        res.status(204).send();
    }catch(err){
        next(err);
    }
};

export{
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
}
import Task from "../models/Task.js";

const createTask = async (taskData, userId) => {
        const newTask = await Task.create({
            ...taskData,
            user: userId //Establish owner of the task
        });
        return newTask;
}

const getAllTasks = async(userId) => {
        const tasks = await Task.find({user: userId}).sort({ createdAt: -1 });
        return tasks;
};

const getTaskById = async(taskId ,userId ) => {
        const task = await Task.findOne({
            _id: taskId,
            user: userId
        });
        if(!task) {
            return createServiceError('Task not found', 404);
        }
        return task;
};

const updateTask = async(taskId, userId, taskData) => {
        const task = await Task.findOneAndUpdate(
            { _id: taskId, user: userId },
            taskData, 
            { new: true, runValidators: true }
        );
        if(!task) {
            return createServiceError('Task not found', 404);
        }
        return task;
};

const deleteTask = async(taskId, userId) => {
        const task = await Task.findOneAndDelete(
            { _id: taskId, user: userId }
        );
        if(!task) {
            return createServiceError('Task not found', 404);
        }
        return task;
};

//Error handling function
const createServiceError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode; 
    return error;
};

export {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
}
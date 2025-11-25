import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title must be at most 100 characters long']
    },
    description: {
        type: String,
        //Ommit required, default is false
        trim: true,
        maxlength: [500, 'Description must be at most 500 characters long']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //Ref to User model
        required: [true, 'Owner of the task is required'],
        immutable: true //Cannot be changed the owner
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    status: {
        type: String,
        required: true,
        trim: true,
        enum: ['Pending', 'In progress', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: {  virtuals: true }
});


const Task = mongoose.model('Task', taskSchema);
export default Task;
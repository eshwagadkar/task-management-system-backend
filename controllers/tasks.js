const mongoose = require('mongoose');

const HttpError = require('../models/http-error'); 

const Task = require('../models/tasks');
const User = require('../models/users');

// Fetch all the tasks
const fetchAllTasks = async (req, res, next) => {

    try{
        const tasks = await Task.find()
        res.status(200).json(tasks);
    } catch (err) {
        const error = new HttpError('Failed to fetch the tasks', 500, false);
        return next(error);
    }
}

// Fetch task using taskid
const fetchATask = async (req, res, next) => {
    
    const taskId = req.params.tid;

    try{
        const task = await Task.findById(taskId);
        // check to find whether the task id entered exists or fake generated one.
        if(task){
            res.json({ task });  // If tid exists/ not fake, return that task.
        } else {
            const error = new HttpError('Couldnot find a task for the provided id', 404, false);
            return next(error);
        }
     } catch (err) {  // If the taskId not a mongo format id or shortened.
        const error = new HttpError('Something went wrong, couldnot find a place', 500, false);
        return next(error);
     }
}

// Fetch task using user-id
const fetchATaskUsingUID = async (req, res, next) => {
    
    const userId = req.params.uid;

    let userWithTasks;
    try{
        // const task = await Task.find({ creator: userId });
        userWithTasks = await User.findById(userId).populate('tasks');
     } catch (err) {  // If the taskId not a mongo format id or shortened.
        const error = new HttpError('Something went wrong, please try again later', 500, false);
        return next(error);
     }

      // check to find whether the user id entered exists or fake generated one.
      if(!userWithTasks || userWithTasks.tasks.length === 0 ){
        const error = new HttpError('Couldnot find a task for the provided id', 404, false);
        return next(error);
    } else {
        res.json({ userWithTasks });  // If uid exists/ not fake, return that task.
    }

}

// Create a Task
const createTask = async (req, res, next) => {

    const { title, description, dueDate, creator } = req.body;

    const createdTask = new Task({ title, description, dueDate, creator });

    // Check id of logged in user whether it exists
    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Creation of a task failed', 500, false);
        return next(error);
    }

    if(!user){
        const error = new HttpError('Couldnot find user for provided id.', 404, false);
        return next(error);
    }

    try {
        // Handling (2) mutiple async tasks concurrently. 
        const sess = await mongoose.startSession();
        sess.startTransaction(); // Start the transaction
        // Task 1: Save the created task
        await createdTask.save({ session : sess });
        // and push the created task id in the tasks array of the created user 
        user.tasks.push(createdTask);
        // Task 2: save the updated user
        await user.save({ session : sess });
        await sess.commitTransaction(); // Commit the transaction
    } catch (err) {
        const error = new HttpError('Creation of a task failed', 500, false);
        return next(error);
    }

    res.status(201).json({ task: createdTask });  

}

// Create a Task
const updateTask = async (req, res, next) => {

    const { title, description, dueDate } = req.body;
    const taskId = req.params.tid;

    try{
        const task = await Task.findByIdAndUpdate(taskId, { title, description, dueDate }, { new: true });
        // check to find whether the task id entered exists or fake generated one.
        if(task){
            res.json({ task });  // If tid exists/ not fake, return that task.
        } else {
            const error = new HttpError('Couldnot find a task for the provided id', 404, false);
            return next(error);
        }
     } catch (err) {  // If the taskId not a mongo format id or shortened.
        const error = new HttpError('Something went wrong, couldnot update a place', 500, false);
        return next(error);
     }
}

// Create a Task
const deleteTask = async (req, res, next) => {

    const taskId = req.params.tid;

    let task;

    try{
        task = await Task.findById(taskId).populate('creator');
     } catch (err) {  
        const error = new HttpError('Something went wrong, couldnot delete a place.', 500, false);
        return next(error);
     }
     
     // check to find whether the task id entered exists or fake generated one.
     if(!task){
         const error = new HttpError('Couldnot find a task for the provided id', 404, false);
         return next(error);
    } 
        
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await task.deleteOne({ session: sess });
        task.creator.tasks.pull(task);
        await task.creator.save({ session : sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, couldnot delete a place', 500, false);
        return next(error);
    }

    res.status(200).json({ success: true, message: 'Successfully Deleted.' })

    }


exports.fetchAllTasks = fetchAllTasks;
exports.fetchATask = fetchATask;
exports.fetchATaskUsingUID =fetchATaskUsingUID;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask
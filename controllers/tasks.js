const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error'); 
const Task = require('../models/tasks');

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

    try{
        const task = await Task.find({ creator: userId });
        // check to find whether the user id entered exists or fake generated one.
        if(!task || task.length === 0 ){
            const error = new HttpError('Couldnot find a task for the provided id', 404, false);
            return next(error);
        } else {
            res.json({ task });  // If uid exists/ not fake, return that task.
        }
     } catch (err) {  // If the taskId not a mongo format id or shortened.
        const error = new HttpError('Something went wrong, please try again later', 500, false);
        return next(error);
     }


    
}

// Create a Task
const createTask = async (req, res, next) => {

    const { title, description, dueDate, creator  } = req.body;

    const task = new Task({ title, description, dueDate, creator });

    try {
        const createdTask = await task.save();
        res.status(201).json(createdTask);
    } catch (err) {
        const error = new HttpError('Creation of a task failed', 500, false);
        return next(error);
    }

}

// Create a Task
const updateTask = async (req, res, next) => {

    const { title, description, dueDate  } = req.body;
    const taskId = req.params.tid;

    const updatedTask = { ...DUMMY_TASKS.find(t => t.id === taskId) };
    const placeIndex = DUMMY_TASKS.findIndex(t => t.id === taskId);
    updatedTask.title = title;
    updatedTask.description =  description;

    DUMMY_TASKS[placeIndex] = updateTask;

    res.status(200).json({ task: updateTask });
}

// Create a Task
const deleteTask = async (req, res, next) => {

    const { title, description, dueDate, creator  } = req.body;

    const createTask = { id: uuidv4(), title, description, dueDate, creator }

    DUMMY_TASKS.unshift(createTask);

    res.status(201).json({ task: createTask })

}

exports.fetchAllTasks = fetchAllTasks;
exports.fetchATask = fetchATask;
exports.fetchATaskUsingUID =fetchATaskUsingUID;
exports.createTask = createTask;
exports.updateTask = updateTask;
exports.deleteTask = deleteTask
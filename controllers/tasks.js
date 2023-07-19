const HttpError = require('../models/http-error'); 

const DUMMY_TASKS = [
    {
        id: 't1',
        title: 'painting', 
        description: 'Painitng the monalisa',
        creator: 'u1'
    },
    {
        id: 't2',
        title: 'reading', 
        description: 'Reading a book',
        creator: 'u2'
    }
]

// Fetch all the tasks
const fetchAllTasks = async (req, res, next) => {

    let tasks;

    try{
         tasks = DUMMY_TASKS.map( t => { return t });

        if(!tasks){
            const error = new HttpError('Tasks not found', 404, false );
            return next(error);
        }
         
    } catch (err){
        const error = new HttpError('Something went wrong in try .', 500, false );
        return next(error);
    }
    
    res.status(201).json(tasks);
}


// Fetch task using taskid
const fetchATask = async (req, res, next) => {
    
    const taskId = req.params.tid;

    let task;

    try {
         task = DUMMY_TASKS.find(task => { return task.id === taskId } );
        
        if(!task){
            const error = new HttpError('Task not found', 404, false );
            return next(error);
        }
        
    } catch (err){
        const error = new HttpError('Something went wrong in try .', 500, false );
        return next(error);
    }

    res.status(201).json(task);
}

// Fetch task using user-id
const fetchATaskUsingUID = async (req, res, next) => {
    
    const userId = req.params.uid;

    let task;

    try {
         task = DUMMY_TASKS.find( task => { return task.creator === userId } );
        
        if(!task){
            const error = new HttpError('Task not found', 404, false );
            return next(error);
        }
        
    } catch (err){
        const error = new HttpError('Something went wrong in try .', 500, false );
        return next(error);
    }

    res.status(201).json(task);
}

exports.fetchAllTasks = fetchAllTasks;
exports.fetchATask = fetchATask;
exports.fetchATaskUsingUID =fetchATaskUsingUID;
const express = require('express');

const taskController = require('../controllers/tasks');
const router = express.Router();

// Fetch all the tasks
router.get('/', taskController.fetchAllTasks)

// Fetch task using taskid
router.get('/:tid', taskController.fetchATask);

// Fetch task using user-id
router.get('/user/:uid', taskController.fetchATaskUsingUID);


module.exports = router;
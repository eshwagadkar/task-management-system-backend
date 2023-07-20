const express = require('express');

const { check } = require('express-validator');


const userControllers = require('../controllers/users');

const router = express.Router();

// Fetch All Users (Only if Admin)
router.get('/', userControllers.fetchAllUsers);

// Fetch a User by id
router.get('/:uid', userControllers.fetchAUser);

// Signup ( Create ) a user 
router.post('/register', [
    check('name')
        .not()
        .isEmpty(),
    check('email')
        .not()
        .isEmpty(),
    check('password')
        .not()
        .isEmpty(),
    check('image')
        .not()
        .isEmpty()
] , userControllers.signUp );

// Update a user
router.patch('/:uid', userControllers.updateUser);

// Delete a user
router.delete('/:uid', userControllers.deleteUser)

module.exports = router;

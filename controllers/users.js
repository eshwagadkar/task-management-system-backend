const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const User = require('../models/users');

// Fetch All Users 
const fetchAllUsers = async (req, res, next) => {

}

// Fetch a User by id
const fetchAUser = async (req, res, next) => {
    
}

// SignUp ( Create ) a User
const signUp = async (req, res, next) => {

    const errors = validationResult(req);
    // const secret = process.env.SECRET_KEY;

    if(!errors.isEmpty()){
        return next (
            new HttpError('Please fill in the required fields!', 422, false )
        );
    }

    const { name, email, password, image, tasks } = req.body;

    // Check if a user exists with 
    let existingUser;

    try {
       existingUser = await User.findOne({ email });
    } catch (err) {
        const error = new HttpError('Signup failed, Please try again later.', 500, false);
        return next(error);
    }

    if(existingUser) {
        const error = new HttpError('User exists already! Please login instead.', 500, false);
        return next(error);
    }

    // Creating a User
    const user = new User({ name, email, password, image, tasks });

    // Save the user created in the mongoDB database
    try{
        const createdUser = await user.save();
        res.status(201).json({ createdUser });
    } catch (err) {
        const error = new HttpError('Signing Up failed, Please try again.', 500, false);
        return next(error);
    }


}

// Update a user
const updateUser = async (req, res, next) => {
    
}

// Delete a user
const deleteUser = async (req, res, next) => {
    
}

exports.fetchAllUsers = fetchAllUsers;
exports.fetchAUser = fetchAUser;
exports.signUp = signUp;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;


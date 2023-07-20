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

// Login a user
const signIn = async (req, res, next) => {

    const errors = validationResult(req);
    // const secret = process.env.SECRET_KEY;

    if(!errors.isEmpty()){
        const error = new HttpError('Please fill in the required fields!', 422, false );
        return next(error);
    }

    const { email, password } = req.body;

    // Check if a user exists with 
    let existingUser;

    try{
       existingUser = await User.findOne({ email });
    } catch(err){
        const error = new HttpError('Unable to signin, Please try again later', 500, false);
        return next(error);
    }

    if(!existingUser || existingUser.password !== password ){
        const error = new HttpError('Invalid password or email', 401, false);
        return next(error);
    }

    res.status(201).json({ message: 'Login Success' });


    // try {
    //     // const userExists = await existingUser.comparePassword(password);
    //     // const token = jwt.sign({ userId: userExists._id, isAdmin: userExists.isAdmin }, secret, { expiresIn: '1d' } );
    //     // res.status(201).json( {  user: userExists.toObject({ getters: true }), token } );
    //     res.status(201).json({ userExists });

    // } catch(err){
    //     const error = new HttpError('Invalid password or email', 500, false);
    //     return next(error);
    // }
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
exports.signIn = signIn;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;


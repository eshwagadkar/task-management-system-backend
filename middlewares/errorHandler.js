const HttpError = require('../models/http-error');

function errorHandler(err, req, res, next) {

    // JWT Authentication Error
    if(err.name === 'UnauthorizedError'){
        const error = new HttpError('The user is not authorized', 500, false);
        return next(error);
    }

    // // Validation Error
    // if(err.name === 'ValidationError'){
    //    return res.status(401).json({ message: err, success: false })
    // }

    // if(res.headerSent){
    //     return next(err);
    // }

    // Default to General: 500 Server Error
    res.status(err.code || 500);
    res.json({
             message: err.message || 'An unknown error occurred!', 
             success: err.success 
             });
} 

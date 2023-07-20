const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const HttpError = require('./models/http-error'); 

// Route Imports
const taskRoute = require('./routes/tasks');
const usersRoute = require('./routes/users');

// Middleware Imports
// const authJwt = require('./middlewares/jwt');
// const errorHandler = require('./middlewares/requireAuth');

const app = express();

require('dotenv').config(); 

const connectDB = require('./mongo-connect');
connectDB();

const api = process.env.API_URL;
const PORT = process.env.PORT;

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////       Middleware Section             //////////////////

// Enable CORS
app.use(cors());
app.options('*', cors());

// Express Middleware to parse/handle incoming and outgoing requests
app.use(express.json());

// Middleware to log api request made from frontend
app.use(morgan('tiny'));

// Middleware to generate JWT
// app.use(authJwt());

// Mark public/uploads as static
// app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// Middleware for Error Handling
// app.use(errorHandler);

// Handling CORS Errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin , X-Requested-With, Content-Type, Accept, Authorization' );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT' );
    next();
})


// Registering the imported routes as a middleware
app.use(`${api}/tasks`, taskRoute);

// Registering the imported routes as a middleware
app.use(`${api}/users`, usersRoute);

// Registering the imported routes as a middleware
// app.use(`${api}/users`, usersRoute);

// Middleeware that handles unsupported routes
app.use((error, res, next) => {
    const err = new HttpError('Could not find this route', 404, false );
    throw err;
})

// Middleware for error handling
app.use((err, req, res, next) => {

    // JWT Authentication Error
    if(err.name === 'UnauthorizedError'){
        return res.status(500).json({ message: 'The user is not authorized', success: false });
    }

     // Validation Error
    if(err.name === 'ValidationError'){
       return res.status(401).json({ message: err, success: false })
    }

    if(res.headerSent){
        return next(err);
    }

    // Default to General: 500 Server Error
    res.status(err.code || 500).json({ message: err.message || 'An unknown error occurred!', success: err.success });

})

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

app.listen(PORT, () => {
    console.log(`The port is up on port: ${PORT}`);
})
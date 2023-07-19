const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_CONNECTION_URI)
        console.log('Connection to Database: Successfull');
    } catch (err) {
        console.log(`Error connecting to the databse: ${err.message}`);
    }
}

module.exports = connectDB

const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        const url = process.env.MONGO_URI;
        await mongoose.connect(url) ;
        console.log("Connected to Database");
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

module.exports = connectDB;


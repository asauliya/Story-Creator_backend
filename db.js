const mongoose = require('mongoose');

const mongoURL = "mongodb://0.0.0.0:27017/test"

const connectToMongo = async (username, password) => {
    try {
        await mongoose.connect(mongoURL, { useNewUrlParser: true })
        console.log('Database connected successfully');
    } catch (error) {
        console.log('Error while connecting to the database ', error);
    }
};
module.exports = connectToMongo;
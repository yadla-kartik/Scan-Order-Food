const mongoose = require('mongoose');


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB);
        console.log('hogaya', mongoose.connection.host);
    } catch (error) {
        mongoose.disconnect();
        process.exit(1);
    }
}

module.exports = {
    connectDB
}
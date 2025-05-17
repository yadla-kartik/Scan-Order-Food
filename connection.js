const mongoose = require('mongoose');


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_DB);
  console.log("MongoDB connected ✅");

    } catch (error) {
        mongoose.disconnect();
        process.exit(1);
    }
}

module.exports = {
    connectDB
}
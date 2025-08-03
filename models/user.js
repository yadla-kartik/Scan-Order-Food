const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        required: true,
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true,
    },
    isOrderDone:{
        type: Boolean,
        default: false,
    },
})


const User = mongoose.model('user', userSchema);

module.exports = User;
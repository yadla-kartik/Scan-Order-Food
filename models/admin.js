const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        reuired: true,
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true,
    },
    role:{
        type: String,
        enum: ['ADMIN', 'CHEF'],
    }
})


const Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;
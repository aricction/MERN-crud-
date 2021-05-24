const mongoose = require('mongoose');

const EmpSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: false
    },
    phone: {
        type: String,
        required: true
        
    },
    designation: {
        type: String,
        required: true
        
    },

    salary: {
        type: String,
        required: true
        
    },

    date: {
        type: Date,
         default: Date.now
    }
});

module.exports = mongoose.model('employee', EmpSchema);
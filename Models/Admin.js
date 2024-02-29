const mongoose = require('mongoose');
const User = require('./User');

const adminSchema = new mongoose.Schema({
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    cinNumber: {
        type: Number,
        required: true,
        unique: true
    }
}, { discriminatorKey: 'role' });

const Admin = User.discriminator('admin', adminSchema);
module.exports = Admin;
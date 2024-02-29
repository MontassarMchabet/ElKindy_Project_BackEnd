const mongoose = require('mongoose');
const User = require('./User');

const profSchema = new mongoose.Schema({
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

const Prof = User.discriminator('prof', profSchema);
module.exports = Prof;
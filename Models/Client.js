const mongoose = require('mongoose');
const User = require('./User');

const clientSchema = new mongoose.Schema({
    parentPhoneNumber: {
        type: Number,
        default: 0
    },
    parentCinNumber: {
        type: Number,
        default: 0
    },
    instrument: {
        type: String,
    },
    otherInstruments: {
        type: String
    },
    fatherOccupation: {
        type: String
    },
    motherOccupation: {
        type: String
    },
    isSubscribed: {
        type: Boolean
    },
    schoolGrade: {
        type: Number,
    }
}, { discriminatorKey: 'role' });

const Client = User.discriminator('client', clientSchema);
module.exports = Client;
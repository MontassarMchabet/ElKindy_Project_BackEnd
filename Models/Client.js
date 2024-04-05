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
    level: {
        type: String,
        enum: ['Initiation', 'Preparatoire', '1eme annee', '2eme annee', '3eme annee', '4eme annee', '5eme annee', '6eme annee', '7eme annee']

    }
}, { discriminatorKey: 'role' });

const Client = User.discriminator('client', clientSchema);
module.exports = Client;
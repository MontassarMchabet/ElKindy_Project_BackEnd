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
        type: Boolean,
        default: false
    },
    level: {
        type: String,
        enum: ['Initiation', 'Préparatoire', '1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année', '7ème année'],
    },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
    subscriptionType: {
        type: String,
        enum: ['Non','monthly', 'yearly', '6 months'],
        default: 'Non'
    },
    subscriptionDate: {
        type: Date
    },
}, { discriminatorKey: 'role' });

const Client = User.discriminator('client', clientSchema);
module.exports = Client;
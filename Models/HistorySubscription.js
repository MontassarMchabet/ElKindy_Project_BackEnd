const mongoose = require('mongoose');

const historySubscriptionSchema = new mongoose.Schema({
    subscriptionType: {
        type: String,
        enum: ['Non','monthly', 'yearly', '6 months'],
        default: 'Non'
    },
    subscriptionDate: {
        type: Date
    },
    subscriptionEndDate: {
        type: Date
    },
    subscriptionPrice: {
        type: Number
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'client' }
}, { timestamps: true });

const HistorySubscription = mongoose.model('HistorySubscription', historySubscriptionSchema);
module.exports = HistorySubscription;
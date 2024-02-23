const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    event: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true 
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true 
    },
    comment: {
        type: String,
        required: true 
    },
    date: {
        type: Date,
        default: Date.now 
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

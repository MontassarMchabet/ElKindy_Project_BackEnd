const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    room_number: String,
    capacity: Number,
    location: String
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;

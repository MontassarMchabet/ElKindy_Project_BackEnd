const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            required: true
        },
        Description: {
            type: String,
            required: true
        },
        imageUrl: {
             type: String 
        },
        Date: {
            type: Date,
            required: true
            
        },
        Location: {
            type: String,
            required: true
            
        },
        price: {
          type: Number,
          required: true
        },
        room: {
            name: { type: String },
            shape: { type: String },
            capacity: { type: Number },
            distributionSeats: [{ type: String }] // You can adjust the type according to the seat distribution structure
        }

    }
)

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
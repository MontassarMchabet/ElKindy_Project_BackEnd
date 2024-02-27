const mongoose = require("mongoose");

const eventSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        imageUrl: {
             type: String 
        },
        date: {
            type: Date,
            required: true
            
        },
        location: {
            type: String,
            required: true
            
        },
        price: {
          type: Number,
          required: true
        },
        room_name: { 
            type: String,
            required: true
        },
        room_shape: { 
            type: String,
            // enum: ['Rectangular', 'Triangular', 'Circle','Square'],
            // default: 'midterm exam'
            required: true
        },
        room_capacity: {
             type: Number,
             required: true 
        },
        room_distributionSeats: [{ type: String }] // You can adjust the type according to the seat distribution structure
    }

    
)

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true 
  },
  ticketType: {
    type: String,
    
  },
  price: {
    type: Number,
    required: true
  },
  selectedSeats: [{ type: String }],
  date: {
      type: Date,
      // default: Date.now 
  },
  paidAt:{
    type: Date,
    default: Date.now(),
  }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
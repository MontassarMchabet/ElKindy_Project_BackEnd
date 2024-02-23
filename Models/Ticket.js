const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  ticketType: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  selectedSeats: [{ type: String }]
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
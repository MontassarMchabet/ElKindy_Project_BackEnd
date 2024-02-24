
const Ticket = require('../Models/Ticket');
const asyncHandler = require("express-async-handler");

async function getAllTicket(req,res){
    try{ 
        const data = await Ticket.find();
        res.send(data);
    }catch (err){
        res.send(err);
    }
}
  const addTicket = asyncHandler(async (req, res) => {
    try {
        const newTicket = await Ticket.create(req.body);
        res.json(newTicket);
    } catch (error) {
        throw new Error(error);
    }
});

const getTicketByid = asyncHandler(async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  if (!ticket) {
    res.status(404).json({ message: "Ticket not found" });
  } else {
    res.json(ticket);
  }
});

// Middleware pour supprimer un ticket par son ID
const deleteTicket = asyncHandler(async (req, res) => {
  const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
  if (!deletedTicket) {
    res.status(404).json({ message: "Ticket not found" });
  } else {
    res.json(deletedTicket);
  }
});

module.exports = {
  getAllTicket,
  getTicketByid,
  addTicket,
  deleteTicket
};

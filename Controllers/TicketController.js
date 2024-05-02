
const Ticket = require('../Models/Ticket');
const asyncHandler = require("express-async-handler");
const fs = require('fs');
const path = require('path');
const sendEmail = require('./NodeMailer');
const filePath = path.join(__dirname, '..', 'EmailTemplate', 'SendEmailReservation.html');


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
const sendMail = async (req, res) => {
  const { email, username } = req.body;
  try {
      const htmlTemplate = fs.readFileSync(filePath, 'utf8');
      const emailContent = htmlTemplate
          .replace('{{ email }}', email)
          .replace('{{ username }}', username);
      const data = {
          to: email,
          subject: " Reservation Confirmation",
          html: emailContent
      };
      await sendEmail(data, req, res);

      res.status(200).json({ message: 'Mail sent successfully'});
  } catch (error) {
      console.error('Error sending Mail:', error);
      res.status(500).json({ message: 'Error sending Mail' });
  }
}


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
  deleteTicket,sendMail
};

const event = require('../Models/Event.js');
const asyncHandler = require("express-async-handler");
const Ticket = require('../Models/Ticket.js');
const Comment = require('../Models/Comment.js');

async function getAllEvent(req,res){
    try{ 
        const data = await event.find();
        res.send(data);
    }catch (err){
        res.send(err);
    }
}

  const addEvent = asyncHandler(async (req, res) => {
    try {
        const newEvent = await event.create(req.body);
        res.json(newEvent);
    } catch (error) {
        throw new Error(error);
    }
});


async function getEventbyid(req, res) {
  try {

    const data = await event.findById(req.params.id);
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}

async function getEventTickets(req, res) {
  try {
    const eventId = req.params.eventId;
    const tickets = await Ticket.find({ event: eventId }).populate('user', 'username').populate('event', 'name');
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function getEventComments(req, res) {
  try {
    const eventId = req.params.eventId;
    const comments = await Comment.find({ event: eventId }).populate('user', 'username profilePicture');
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

const deleteEvent = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const deletedEvent = await event.findByIdAndDelete(id);
      res.json(deletedEvent);
    } catch (error) {
      throw new Error(error);
    }
  });


const updateEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const updatedEvent = await event.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      if (!updatedEvent) {
        return res.status(404).json({ error: "Couldn't find Event" });
      }
      res.json(updatedEvent);
    } catch (error) {
      throw new Error(error);
    }
  });

  module.exports = {
    getAllEvent,getEventbyid,addEvent,deleteEvent,updateEvent,getEventTickets,getEventComments
  };
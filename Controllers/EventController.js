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
// async function addEvent(req, res, next) {
//   try {
  
//     const event = new Event(req.body);
//     await event.save();
//     res.status(200).send("add success");
//   } catch (err) {
//     res.status(400).send({ error: error.toString() });
//   }
// }

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
// async function getEventTicketsPage(req, res) {
  // try {
    
  //   // Recherchez l'événement dans la base de données en utilisant son ID
  //   const event = await event.findById(req.params.id);
//     if (!event) {
//         return res.status(404).json({ error: "Événement non trouvé" });
//     }
//     // Renvoyer la page de tickets liée à cet événement
//     res.render('tickets', { event });
// } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Erreur serveur" });
// }
// async function getEventTickets(req, res) {

//   try {
//     const eventId = req.params.eventId;
//     const tickets = await Ticket.find({ event: eventId });
//     res.json(tickets);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// }
async function getEventTickets(req, res) {
  try {
    const eventId = req.params.eventId;
    const tickets = await Ticket.find({ event: eventId }).populate('user', 'username').populate('event', 'name');
    // Le champ 'user' dans chaque ticket sera maintenant remplacé par l'objet complet de l'utilisateur, contenant uniquement le nom d'utilisateur.
    // Le champ 'event' dans chaque ticket sera maintenant remplacé par l'objet complet de l'événement, contenant uniquement le titre.
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
// async function getEventComments(req, res) {

//   try {
//     const eventId = req.params.eventId;
//     const comments = await Comment.find({ event: eventId });
//     res.json(comments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// }
async function getEventComments(req, res) {
  try {
    const eventId = req.params.eventId;
    const comments = await Comment.find({ event: eventId }).populate('user', 'username profilePicture');
    // Le champ 'user' dans chaque commentaire sera maintenant remplacé par l'objet complet de l'utilisateur, contenant uniquement le nom d'utilisateur et l'image.
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
      // Let asyncHandler handle the error
      throw new Error(error);
    }
  });

  module.exports = {
    getAllEvent,getEventbyid,addEvent,deleteEvent,updateEvent,getEventTickets,getEventComments
  };
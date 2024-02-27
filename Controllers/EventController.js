const event = require('../Models/Event.js');
const asyncHandler = require("express-async-handler");

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
    getAllEvent,getEventbyid,addEvent,deleteEvent,updateEvent
  };
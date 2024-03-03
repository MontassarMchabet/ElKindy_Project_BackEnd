var express = require('express');
var router = express.Router();
const eventController = require("../Controllers/EventController");



/* GET all events */
router.get("/all", eventController.getAllEvent);

/* GET  event by id */
router.get("/:id", eventController.getEventbyid);

/* Add a new event */
router.post("/add", eventController.addEvent);

/* Update a event */
router.put("/update/:id", eventController.updateEvent);

/* delete event */
router.delete("/delete/:id", eventController.deleteEvent);
router.get('/:eventId/tickets', eventController.getEventTickets);
router.get('/:eventId/comments', eventController.getEventComments);

module.exports = router;

var express = require('express');
var router = express.Router();
const ticketController = require("../Controllers/TicketController");
const { Add, Verify } = require("../Controllers/Payement");
const { sendMail } = require("../Controllers/TicketController");


/* GET all ticket */
router.get("/", ticketController.getAllTicket);

/* GET  ticket by id */
router.get("/:id", ticketController.getTicketByid);

/* Add a new ticket */
router.post("/add", ticketController.addTicket);


/* delete ticket */
router.delete("/:id", ticketController.deleteTicket);


/*payement*/

router.post("/payement", Add)
router.get("/payement/:id", Verify) 
router.post('/sendMail', sendMail)

module.exports = router;

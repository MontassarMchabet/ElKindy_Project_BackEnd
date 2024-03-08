const express = require('express');
const router = express.Router();
const RoomController = require('../Controllers/RoomController');
// Routes for CRUD operations
router.get('/getall', RoomController.getAllRooms);
router.get('/getById/:id', RoomController.getRoomById);
router.post('/add', RoomController.createRoom);
router.put('/update/:id', RoomController.updateRoom);
router.delete('/delete/:id', RoomController.deleteRoom);

module.exports = router;
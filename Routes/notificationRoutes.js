const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/NotificationController');

router.post('/add', notificationController.sendNotification);

router.put('/update/:id/seen', notificationController.updateNotification);

module.exports = router;
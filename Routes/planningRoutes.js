const express = require('express');
const router = express.Router();
const planningController = require('../Controllers/planningController');
// Routes for CRUD operations
router.get('/getall', planningController.getAllPlannings);
router.get('/getById/:id', planningController.getPlanningById);
router.post('/add', planningController.createPlanning);
router.put('/update/:id', planningController.updatePlanning);
router.delete('/delete/:id', planningController.deletePlanning);

module.exports = router;
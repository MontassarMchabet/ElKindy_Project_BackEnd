const express = require('express');
const router = express.Router();
const planningController = require('../Controllers/planningController');
const validatePlanning = require('../Controllers/validatePlanning');
// Routes for CRUD operations
router.get('/getall', planningController.getAllPlannings);
router.get('/getById/:id', planningController.getPlanningById);
router.post('/add', planningController.createPlanning);
router.put('/update/:id', planningController.updatePlanning);
router.delete('/delete/:id', planningController.deletePlanning);
router.get('/availability/room/:roomId/:date/:startTime/:endTime',planningController.isRoomAvailable );
router.get('/availability/teacher/:teacherId/:date/:startTime/:endTime',planningController.isTeacherAvailable );
router.get('/availability/studends/:studentIds/:date/:startTime/:endTime', planningController.areStudentsAvailable);
router.get('/CheckDuration/:startTime/:endTime', validatePlanning.CheckDurationOfCourse);
router.get('/TotalIndividualStudy/:userId/:date/:startTime/:endTime/:courseId', validatePlanning.calculateTotalIndividualStudy);
router.get('/TotalStudyHours/:userId/:date/:startTime/:endTime', validatePlanning.calculateTotalStudyHours);
module.exports = router;
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
router.get('/CheckDuration/:startTime/:endTime/:type', validatePlanning.CheckDurationOfCourse);
router.get('/TotalIndividualStudy/:userId/:date/:type', validatePlanning.calculateTotalIndividualStudy);
router.get('/TotalStudyHours/:classroomId/:date/:startTime/:endTime', validatePlanning.calculateTotalStudyHours);
router.get('/getallStudent', planningController.getPlanningWithStudentIds);
router.get('/getByTeacherId/:teacherId', planningController.getPlanningWithTeacherId);
module.exports = router;
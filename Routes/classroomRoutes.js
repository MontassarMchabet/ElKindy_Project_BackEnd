const express = require('express');
const router = express.Router();
const classroomController = require('../Controllers/classroomController');

router.post('/add', classroomController.createClassrom);
router.get('/getall', classroomController.getAllclassroom);

router.get('/getById/:id', classroomController.getClassroomById);
router.put('/update/:id', classroomController.updateClassroom);
router.delete('/delete/:id', classroomController.deleteClassroom);
module.exports = router;
const express = require('express');
const router = express.Router();
const CourseController = require('../Controllers/CourseController');
// Routes for CRUD operations
router.get('/getall', CourseController.getAllCourses);
router.get('/getById/:id', CourseController.getCourseById);
router.post('/add', CourseController.createCourse);
router.put('/update/:id', CourseController.updateCourse);
router.delete('/delete/:id', CourseController.deleteCourse);

module.exports = router;
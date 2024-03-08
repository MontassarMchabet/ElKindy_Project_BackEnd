const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['group', 'individual'], required: true },
  duration: { type: Number, required: true },
  /* startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }, */
  capacity: { type: Number, default: 10 },
  
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;

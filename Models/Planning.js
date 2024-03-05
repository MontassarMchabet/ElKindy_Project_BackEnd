const mongoose = require('mongoose');

const planningSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserP', required: true },
  studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserP' }]
  
});

const Planning = mongoose.model('Planning', planningSchema);
module.exports = Planning;

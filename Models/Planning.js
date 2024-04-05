const mongoose = require('mongoose');

const planningSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  type: { type: String, enum: ['solfège', 'instrument'], required: true },
 /*  //courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }, */
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' },
  studentIds: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  
});


const Planning = mongoose.model('Planning', planningSchema);
module.exports = Planning;

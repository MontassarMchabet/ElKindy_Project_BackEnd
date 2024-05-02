const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  roomName: {
    type: String,
    required: true,
  },
  teacherName: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String, // Utilisez un format de temps tel que "14:30"
    required: true,
  },
  participants: {
    type: [mongoose.Schema.Types.ObjectId], // Liste des étudiants qui participent à la réunion
    ref: 'User', // Référence à la collection des utilisateurs
    default: [],
  },
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;

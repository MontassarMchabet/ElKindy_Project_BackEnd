const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      
    },
    quizz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "prof", 
      
    },
    content: {
      type: String,
    },
    score: {
      type: Number,
      required: true,
    },
    
  },
);

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;

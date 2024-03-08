const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
    answer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "prof", 
      required: true,
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

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  questionPic: String,
  questionType: String,
  answerSelectionType: String,
  answers: [String],
  correctAnswer: String,
  messageForCorrectAnswer: String,
  messageForIncorrectAnswer: String,
  explanation: String,
  point: String,
});

const quizSchema = new mongoose.Schema({
  quizTitle: String,
  quizSynopsis: String,
  nrOfQuestions: String,
  questions: [questionSchema],
});

module.exports = mongoose.model("Quiz", quizSchema);

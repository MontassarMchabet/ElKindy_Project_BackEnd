const mongoose = require("mongoose"); 


var examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    endAt: {
        type: Date,
    },
    pdfFile: {
      type: String
  },
  schoolGrade: {
    type: Number
},
    type: {
        type: String,
        enum: ['revison', 'end of year exam', 'midterm exam'],
        default: 'midterm exam'
    },
    format: {
        type: String,
        enum: ['pdf', 'quizz'],
        default: 'pdf'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
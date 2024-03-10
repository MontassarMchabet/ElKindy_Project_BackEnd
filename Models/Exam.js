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
  level: {
    type: String,
    enum: ['Initiation', 'Préparatoire', '1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année', '7ème année']

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
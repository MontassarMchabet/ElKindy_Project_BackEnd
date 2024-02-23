const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    endAt: {
        type: Date,
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
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

//Export the model
module.exports = mongoose.model("Exam", examSchema);
const express = require("express");
const router = express.Router();


const Quiz =require("../Models/Quiz")

// Route to add a new quiz
router.post('/quizzes', async (req, res) => {
  try {
 
    const { quizTitle, quizSynopsis, nrOfQuestions, questions } = req.body;

  
    const newQuiz = new Quiz({
      quizTitle,
      quizSynopsis,
      nrOfQuestions,
      questions
    });

    const savedQuiz = await newQuiz.save();

    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to fetch all quizzes
router.get('/quizzes/all', async (req, res) => {
    try {

      const quizzes = await Quiz.find();
      res.status(200).json(quizzes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  
  // Route to fetch a quiz by its ID
  router.get('/quizzes/:id', async (req, res) => {
    const quizId = req.params.id;
    try {
    
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      res.status(200).json(quiz);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;

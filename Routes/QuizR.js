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
  

// Update a quiz
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedQuiz = await Quiz.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    if (!updatedQuiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find and delete the exam by ID
    const deletedquiz= await Quiz.findByIdAndDelete(id);
    if (!deletedquiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const Answer = require('../Models/Answer');
const Note = require("../Models/Note");

router.post("/", async (req, res) => {
  try {
    const { answerId, teacherId, content, score } = req.body;

    
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({ success: false, message: "Answer not found" });
    }

    const newNote = new Note({
      exam: answer.exam, 
      client: answer.client,
      answer: answerId,
      teacher: teacherId,
      content: content,
      score: score,
    });

    await newNote.save();

    res.json({ success: true, message: "Score assigned successfully" });
  } catch (error) {
    console.error("Error assigning score:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.post("/quiz/", async (req, res) => {
  try {
    const { quizz, client, content, score } = req.body;

    const newNote = new Note({
      quizz: quizz, 
      client: client,
      content: content,
      score: score,
    });

    await newNote.save();

    res.json({ success: true, message: "Score assigned successfully" });
  } catch (error) {
    console.error("Error assigning score:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});



router.get('/byanswer/:answerId', async (req, res) => {
  try {
      // Find the note associated with the provided answer ID
      const note = await Note.findOne({ answer: req.params.answerId });

      if (!note) {
          return res.status(404).json({ message: 'Note not found for the provided answer ID' });
      }

      res.json(note);
  } catch (error) {
      console.error('Error fetching note by answer ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to get notes of a certain client with answer and exam details
router.get('/byclient/:clientId', async (req, res) => {
  try {
      const clientId = req.params.clientId;

      // Find notes for the given client and populate the associated answer and exam details
      const notes = await Note.find({ client: clientId })
          .populate('answer')
          .populate('exam')
          .populate('quizz') 
          .exec();

      res.json(notes);
  } catch (error) {
      console.error('Error fetching notes for client:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Route to check if a document with given clientId and quizzId exists in the Note collection
router.post('/check', async (req, res) => {
  try {
    const { clientId, quizzId } = req.body;

    // Query the database to find a document with the given clientId and quizzId
    const existingNote = await Note.findOne({ client: clientId, quizz: quizzId });

    // If a document is found, return true to indicate that the button should be disabled
    const isButtonDisabled = !!existingNote;

    res.json({ isButtonDisabled });
  } catch (error) {
    console.error('Error checking Note document:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

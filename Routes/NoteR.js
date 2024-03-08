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

module.exports = router;

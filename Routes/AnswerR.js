const express = require("express");
const router = express.Router();
const Answer = require('../Models/Answer');
const {createAnswer,getAnswersByExamId,getAnswersByClientId} = require("../Controllers/AnswerController");

router.post("/", createAnswer);
router.get('/answers/:examId', getAnswersByExamId);
router.get('/answersclient/:clientId',getAnswersByClientId);

router.get('/exam/:examId/client/:clientId', async (req, res) => {
    try {
        const { examId, clientId } = req.params;

        // Check if there is an answer for the given examId and clientId
        const answer = await Answer.findOne({ exam: examId, client: clientId });

        // Send response with the answer if it exists
        if (answer) {
            res.json({ answer });
        } else {
            res.json({ message: "Client has not answered the exam yet" });
        }
    } catch (error) {
        // Handle errors
        console.error("Error checking if client has answered the exam:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


module.exports = router;
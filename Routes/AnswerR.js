const express = require("express");
const router = express.Router();
const Answer = require('../Models/Answer');
const Exam = require('../Models/Exam');
const axios = require('axios');

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

router.get('/fetch-answer-pdf-by-exam/:examId', async (req, res) => {
    try {
        // Extract exam ID from request parameters
        const { examId } = req.params;

        // Check if the exam exists
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Fetch all answers related to the exam
        const answers = await Answer.find({ exam: examId });

        // Fetch PDFs for each answer
        const pdfData = [];
        for (const answer of answers) {
            const pdfUrl = answer.answerPdf;
            const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });
            const pdfBuffer = Buffer.from(response.data, 'binary');
            pdfData.push(pdfBuffer);
        }

        // Send PDFs in response
        res.status(200).json(pdfData);
    } catch (error) {
        console.error('Error fetching PDF answers by exam ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
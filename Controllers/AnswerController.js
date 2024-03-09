const Exam = require('../Models/Exam');
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Client = require('../Models/Client');
const Answer = require('../Models/Answer');

const createAnswer = asyncHandler(async (req, res) => {
    try {
        const { examId, answerPdf ,clientId} = req.body;
        //const clientId = req.user.id;
        const client= await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Exam not found" });
        }
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }
  
        const newAnswerData = {
            exam: examId,
            client: clientId,
            answerPdf,
        };
  
        const newAnswer = await Answer.create(newAnswerData);
        res.json(newAnswer);
    } catch (error) {
        console.error("Error creating answer:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = {
    createAnswer,
    
};
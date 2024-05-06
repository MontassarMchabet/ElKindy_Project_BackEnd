const Exam = require('../Models/Exam');
const asyncHandler = require("express-async-handler");
const Client = require('../Models/Client');
const Answer = require('../Models/Answer');

const createAnswer = asyncHandler(async (req, res) => {
    try {
        const { examId, answerPdf ,clientId} = req.body;
        //const clientId = req.user.id;
        const client= await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "client not found" });
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

const getAnswersByExamId = async (req, res) => {
    try {
        // Extract exam ID from request parameters
        const { examId } = req.params;

        // Check if the exam exists
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Fetch all answers related to the exam
        const answers = await Answer.find({ exam: examId }).populate({
            path: 'client',
            model: 'User', 
            select: 'name lastname email profilePicture', 
          });;


        res.status(200).json(answers);
    } catch (error) {
        console.error('Error fetching answers by exam ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getAnswersByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;

        // Check if the client exists
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Fetch answers related to the client ID
        const answers = await Answer.find({ client: clientId }).populate({
            path: 'client',
            model: 'User', 
            select: 'name lastname email',
        });

        res.status(200).json(answers);
    } catch (error) {
        console.error('Error fetching answers by client ID:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createAnswer, getAnswersByExamId,getAnswersByClientId,
    
};
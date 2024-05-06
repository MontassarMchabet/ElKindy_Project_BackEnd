const Exam = require('../Models/Exam');
const asyncHandler = require("express-async-handler");

const Client = require('../Models/Client');
const Prof = require('../Models/Prof')
const fs = require('fs');
const path = require('path');
const sendEmail = require('../Controllers/NodeMailer');
const filePath = path.join(__dirname, '..', 'EmailTemplate', 'index.html');

const createExam = asyncHandler(async (req, res) => {
  try {
    const { title, description, type, format, pdfFile,level,prof , endAt,quiz} = req.body;
    const newExamData = {
      title,
      description,
      type,
      format,
      pdfFile: pdfFile || "",
      level,
      prof,
      endAt,
      quiz,
    };
    const newExam = await Exam.create(newExamData);
    res.json(newExam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getExam = asyncHandler(async (req, res) => {
  try {
    console.log('Request parameters:', req.params); 
    const { id } = req.params; 
    const findExam = await Exam.findById(id).populate('quiz'); // Populate the quiz field
    if (!findExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    res.json(findExam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


///Get all exams
  const getAllExam = asyncHandler(async (req, res) => {
    try {
      const findAllExam = await Exam.find();
      res.json(findAllExam);
    } catch (error) {
      throw new Error(error);
    }
  });


  const sendVerificationCode = async (req, res) => {
    const { email, username } = req.body;
    try {
        
        const htmlTemplate = fs.readFileSync(filePath, 'utf8');
        const emailContent = htmlTemplate
            .replace('{{ email }}', email)
            .replace('{{ username }}', username)
        const data = {
            to: email,
            subject: "Hi there! Verify your email address!",
            html: emailContent
        };
        await sendEmail(data, req, res);

        res.status(200).json({ message: 'Exam email notification sent successfully' });
    } catch (error) {
        console.error('Error sending Exam email notification :', error);
        res.status(500).json({ message: 'Error sending Exam email notification ' });
    }
};

  const deleteExam = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const deleteExam = await Exam.findByIdAndDelete(id);
      res.json(deleteExam);
    } catch (error) {
      throw new Error(error);
    }
  });

  const updateExam = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const updatedExam = await Exam.findOneAndUpdate({ _id: id }, req.body, {
        new: true,
      });
      if (!updatedExam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      res.json(updatedExam);
    } catch (error) {
      throw new Error(error);
    }
  });

  const getExamsByClass = asyncHandler(async (req, res) => {
    const { level } = req.params;

    console.log("Received request with level:", level);

    try {
        
        if (!['Initiation', 'Préparatoire', '1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année', '7ème année'].includes(level)) {
            return res.status(400).json({ message: "Invalid level provided" });
        }

        const exams = await Exam.find({ level: level });

        res.json(exams);
    } catch (error) {
        console.error("Error getting exams by level:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const getExamsByClientGrade = asyncHandler(async (req, res) => {
  const { level } = req.params;

  try {

    const client = await Client.findById(req.user.id); 

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const exams = await Exam.find({ level: client.level });

    res.json(exams);
  } catch (error) {
    console.error("Error getting exams by client grade:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const getExamsByProfId = asyncHandler(async (req, res) => {

  try {
    
    const profe= await Prof.findById(req.user.id);

   
    if (!profe) {
      return res.status(404).json({ message: "Professor not found" });
    }
    const exams = await Exam.find({ prof: profe._id });

    res.json(exams);
  } catch (error) {
    console.error("Error getting exams by professor ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {
    createExam,
    getExam,
    getAllExam,
    deleteExam,
    updateExam,
    getExamsByClass,
    getExamsByClientGrade,
    getExamsByProfId,
    sendVerificationCode,
};
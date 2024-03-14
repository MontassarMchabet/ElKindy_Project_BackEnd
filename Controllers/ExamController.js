const Exam = require('../Models/Exam');
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Client = require('../Models/Client');
const Prof = require('../Models/Prof')

const createExam = asyncHandler(async (req, res) => {
  try {
    const { title, description, type, format, pdfFile,level,prof } = req.body;
    const newExamData = {
      title,
      description,
      type,
      format,
      pdfFile: pdfFile || "",
      level,
      prof,
    };
    const newExam = await Exam.create(newExamData);
    res.json(newExam);
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

///get exam by id
const getExam = asyncHandler(async (req, res) => {
  try {
      console.log('Request parameters:', req.params); 
      const { id } = req.params; 
      const findExam = await Exam.findById(id); 
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

  const getExamsByProfId = asyncHandler(async (req, res) => {
    try {
        const professorId = req.params.profId;

        
        const exams = await Exam.find({ prof: professorId });

        res.json(exams);
    } catch (error) {
        throw new Error(error);
    }
});


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



  /// get exams of a spesific class
  const getExamsByClass = asyncHandler(async (req, res) => {
    const { level } = req.params;

    console.log("Received request with level:", level);

    try {
        // Ensure the level is one of the valid options
        if (!['Initiation', 'Préparatoire', '1ère année', '2ème année', '3ème année', '4ème année', '5ème année', '6ème année', '7ème année'].includes(level)) {
            return res.status(400).json({ message: "Invalid level provided" });
        }

        const exams = await Exam.find({ level: level });
      // Log the exams found

        res.json(exams);
    } catch (error) {
        console.error("Error getting exams by level:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

  
  /// get exams for the client
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


module.exports = {
    createExam,
    getExam,
    getAllExam,
    deleteExam,
    updateExam,
    getExamsByClass,
    getExamsByClientGrade,
    getExamsByProfId,
};
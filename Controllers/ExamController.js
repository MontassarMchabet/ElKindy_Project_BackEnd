const Exam = require('../Models/Exam');
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Client = require('../Models/Client');

const createExam = asyncHandler(async (req, res) => {
  try {
    const { title, description, type, format, pdfFile,schoolGrade } = req.body;
    const newExamData = {
      title,
      description,
      type,
      format,
      pdfFile: pdfFile || "",
      schoolGrade,
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
    const { id } = req.query;
    try {
      const findExam = await Exam.findById(id);
      res.json(findExam);
    } catch (error) {
      throw new Error(error);
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
  const { schoolGrade } = req.params;

  try {
    const exams = await Exam.find({ schoolGrade: schoolGrade });
    res.json(exams);
  } catch (error) {
    console.error("Error getting exams by class:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

  /// get exams for the client
const getExamsByClientGrade = asyncHandler(async (req, res) => {
  const { schoolGrade } = req.params;

  try {

    const client = await Client.findById(req.user.id); 

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const exams = await Exam.find({ schoolGrade: client.schoolGrade });

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
};
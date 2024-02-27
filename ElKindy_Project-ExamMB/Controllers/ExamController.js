const Exam = require('../Models/Exam');
const asyncHandler = require("express-async-handler");
const axios = require("axios");


const createExam = asyncHandler(async (req, res) => {
  try {
      const { title, description, type, format, pdfFile } = req.body;
      let images = [];

      
      if (format === 'pdf' && pdfFile) {
          const formData = new FormData();
          formData.append('image', pdfFile); 

          const imageResponse = await axios.post('http://localhost:8080/api/uploadimage', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });

          images.push({ public_id: imageResponse.data.public_id, url: imageResponse.data.downloadURL });
      }

      const newExamData = { title, description, type, format };
      if (images.length > 0) {
          newExamData.images = images;
      }

      const newExam = await Exam.create(newExamData);
      res.json(newExam);
  } catch (error) {
      console.error("Error creating exam:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});


const getExam = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const findExam = await Exam.findById(id);
      res.json(findExam);
    } catch (error) {
      throw new Error(error);
    }
  });

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
      // Let asyncHandler handle the error
      throw new Error(error);
    }
  });

module.exports = {
    createExam,
    getExam,
    getAllExam,
    deleteExam,
    updateExam,
};
const Exam = require('../Models/Exam');
const asyncHandler = require("express-async-handler");

const createExam = asyncHandler(async (req, res) => {
    try {
        const newExam = await Exam.create(req.body);
        res.json(newExam);
    } catch (error) {
        throw new Error(error);
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
      const deleteExam = await Exam.findOneAndDelete(id);
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
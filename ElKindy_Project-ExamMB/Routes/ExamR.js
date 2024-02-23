const express = require("express");
const router = express.Router();
const {createExam, getExam, getAllExam, deleteExam, updateExam} = require("../Controllers/ExamController");

  router.post("/", createExam);
  router.get("/:id", getExam);
  router.get("/", getAllExam);
  router.delete("/:id", deleteExam);
  router.put("/:id", updateExam);


  module.exports = router
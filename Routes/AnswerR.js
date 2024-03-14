const express = require("express");
const router = express.Router();
const Answer = require('../Models/Answer');
const {createAnswer,getAnswersByExamId} = require("../Controllers/AnswerController");

router.post("/", createAnswer);
router.get('/answers/:examId', getAnswersByExamId);

module.exports = router;
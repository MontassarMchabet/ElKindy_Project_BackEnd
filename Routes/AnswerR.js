const express = require("express");
const router = express.Router();
const Answer = require('../Models/Answer');
const {createAnswer} = require("../Controllers/AnswerController");

router.post("/", createAnswer);

module.exports = router;
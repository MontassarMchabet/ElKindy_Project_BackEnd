const express = require("express")
const authRouter = require('./Routes/Auth');
const exam = require('./Routes/ExamR');
const answer = require('./Routes/AnswerR');
const note = require('./Routes/NoteR');
const connectdb = require('./db');
const UploadImage = require('./Controllers/UploadImage');

require('dotenv').config();
var cors = require('cors')
var app = express()

app.use(cors());

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/exam', exam);
app.use('/api/answer', answer);
app.use('/api/note', note);
app.use('/api/image', UploadImage);
connectdb();
app.listen(process.env.port, function () {
    console.log("Started application on port %d", process.env.port)
});
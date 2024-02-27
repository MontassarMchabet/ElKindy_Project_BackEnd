const express = require("express")
const authRouter = require('./Routes/Auth');
const exam = require('./Routes/ExamR');
const connectdb = require('./db');


require('dotenv').config();
var cors = require('cors')
var app = express()

app.use(cors());

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/exam', exam);

connectdb();
app.listen(process.env.port, function () {
    console.log("Started application on port %d", process.env.port)
});
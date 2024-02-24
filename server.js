const express = require("express")
const authRouter = require('./Routes/Auth');
const planningRouter = require('./routes/planningRoutes');
const CourseRouter = require('./Routes/CourseRoutes');
const RoomRouter = require('./Routes/RoomRoutes');
const connectdb = require('./db');
var cors = require('cors')
require('dotenv').config();
var app = express()

app.use(cors());

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/plannings', planningRouter);
app.use('/api/Course', CourseRouter);
app.use('/api/Room', RoomRouter);

connectdb();
app.listen(process.env.port, function () {
    console.log("Started application on port %d", process.env.port)
});
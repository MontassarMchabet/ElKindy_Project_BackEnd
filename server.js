const express = require("express")
const authRouter = require('./Routes/Auth');
const exam = require('./Routes/ExamR');
const answer = require('./Routes/AnswerR');
const note = require('./Routes/NoteR');
const UploadImage = require('./Controllers/UploadImage');

const planningRouter = require('./routes/planningRoutes');
const CourseRouter = require('./Routes/CourseRoutes');
const RoomRouter = require('./Routes/RoomRoutes');
const classroomRoutes = require('./Routes/classroomRoutes');
var cors = require('cors')

const eventRouter = require('./Routes/Event');
const commentRouter = require('./Routes/Comment');
const ticketRouter = require('./Routes/Ticket');


const product = require('./Routes/Product');
const connectdb = require('./Config/db');

const cookieParser = require('cookie-parser');


require('dotenv').config();
var cors = require('cors')
var app = express()
app.use(cookieParser());
app.use(express.json());

app.use(cors());


app.use('/api/auth', authRouter);
app.use('/api/exam', exam);
app.use('/api/answer', answer);
app.use('/api/note', note);
app.use('/api/image', UploadImage);



//app.use('/api/auth', authRouter);
app.use('/api/plannings', planningRouter);
app.use('/api/Course', CourseRouter);
app.use('/api/Room', RoomRouter);
app.use('/api/classroom', classroomRoutes);
app.use('/event', eventRouter);
app.use('/comment', commentRouter);
app.use('/tickets', ticketRouter);

app.use('/api/product', product);



//app.use('/api/auth', authRouter);
app.use('/api/image', UploadImage);



connectdb();
app.listen(process.env.port, function () {
    console.log("Started application on port %d", process.env.port)
});
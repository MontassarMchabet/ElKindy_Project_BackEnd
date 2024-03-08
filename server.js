const express = require("express")
const authRouter = require('./Routes/Auth');
const planningRouter = require('./routes/planningRoutes');
const CourseRouter = require('./Routes/CourseRoutes');
const RoomRouter = require('./Routes/RoomRoutes');
var cors = require('cors')

const eventRouter = require('./Routes/Event');
const commentRouter = require('./Routes/Comment');
const ticketRouter = require('./Routes/Ticket');


const product = require('./Routes/Product');
const connectdb = require('./Config/db');

const UploadImage = require('./Controllers/UploadImage');
const cookieParser = require('cookie-parser');

require('dotenv').config();
var cors = require('cors')
var app = express()

app.use(cors());


app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/plannings', planningRouter);
app.use('/api/Course', CourseRouter);
app.use('/api/Room', RoomRouter);

app.use('/event', eventRouter);
app.use('/comment', commentRouter);
app.use('/tickets', ticketRouter);

app.use('/api/product', product);

app.use(cookieParser());
app.use(express.json());


app.use('/api/auth', authRouter);
app.use('/api/image', UploadImage);




connectdb();
app.listen(process.env.port, function () {
    console.log("Started application on port %d", process.env.port)
});
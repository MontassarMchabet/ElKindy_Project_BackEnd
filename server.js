const express = require("express")
const authRouter = require('./Routes/Auth');
const exam = require('./Routes/ExamR');
const answer = require('./Routes/AnswerR');
const note = require('./Routes/NoteR');
const UploadImage = require('./Controllers/UploadImage');
const quizz = require('./Routes/QuizR');
const planningRouter = require('./routes/planningRoutes');
const CourseRouter = require('./Routes/CourseRoutes');
const RoomRouter = require('./Routes/RoomRoutes');
const { Server, Socket } = require('socket.io');
const http = require("http");



const server = http.createServer(app);
// Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
    },
});

// Handle socket connections
io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("sendNotification", async ({ senderName, receiverName,   }) => {
        try {
            //const receiver = await getUser(receiverName);
            
            io.emit("getNotification", {
                senderName,
                orderStatus,
            });
            console.log(senderName+"  sendername log backend");
            console.log(receiver+ " receivername log backend");
        } catch (error) {
            console.error('Error sending notification:', error);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});



const classroomRoutes = require('./Routes/classroomRoutes');
var cors = require('cors')

const eventRouter = require('./Routes/Event');
const commentRouter = require('./Routes/Comment');
const ticketRouter = require('./Routes/Ticket');
const product = require('./Routes/Product');
const cupon = require('./Routes/Cupon');
const cart = require('./Routes/Cart');
const order = require('./Routes/Order');


const connectdb = require('./Config/db');

const cookieParser = require('cookie-parser');

require('dotenv').config();
var cors = require('cors');
var app = express()


app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api/exam', exam);
app.use('/api/answer', answer);
app.use('/api/note', note);
app.use('/api/image', UploadImage);
app.use('/api/quiz', quizz);



//app.use('/api/auth', authRouter);
app.use('/api/plannings', planningRouter);
app.use('/api/Course', CourseRouter);
app.use('/api/Room', RoomRouter);

app.use('/api/classroom', classroomRoutes);

app.use('/event', eventRouter);
app.use('/comment', commentRouter);
app.use('/tickets', ticketRouter);
app.use('/api/product', product);

app.use('/api/cupon', cupon);
app.use('/api/cart', cart);
app.use('/api/order', order);



//app.use('/api/auth', authRouter);
app.use('/api/image', UploadImage);


connectdb();
app.listen(process.env.port, function () {
    console.log("Started application on port %d", process.env.port)
});

const PORT = 8089; // Port number
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
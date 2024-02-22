const express = require("express")
const authRouter = require('./Routes/Auth');
const connectdb = require('./db');
var cors = require('cors')
require('dotenv').config();
var app = express()

app.use(cors());

app.use(express.json());
app.use('/api/auth', authRouter);

connectdb();
app.listen(process.env.port, function () {
    console.log("Started application on port %d", process.env.port)
});
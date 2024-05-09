const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');
const Prof = require('../Models/Prof');
const Client = require('../Models/Client');
const validateMongoDbId = require('../Helpers/ValidateID');
const crypto = require('crypto');
const sendEmail = require('../Controllers/NodeMailer');
const fs = require('fs');
const path = require('path');
const HistorySubscription = require('../Models/HistorySubscription');
const filePath = path.join(__dirname, '..', 'EmailTemplate', 'index.html');
const filePathTwo = path.join(__dirname, '..', 'EmailTemplate', 'SendInfosAdminProf.html');
const filePathThree = path.join(__dirname, '..', 'EmailTemplate', 'SendVerificationCode.html');


const checkCINAdminProf = async (req, res) => {
    try {
        const existingAdminCin = await Admin.findOne({ cinNumber: req.params.cinNumber });
        const existingProfCin = await Prof.findOne({ cinNumber: req.params.cinNumber });
        if (existingAdminCin || existingProfCin) {
            return res.json({ exists: true });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Error checking cin:', error);
        res.status(500).json({ message: 'Error checking cin' });
    }
}

const checkPhoneAdminProf = async (req, res) => {
    try {
        const existingAdminPhone = await Admin.findOne({ phoneNumber: req.params.phoneNumber });
        const existingProfPhone = await Prof.findOne({ phoneNumber: req.params.phoneNumber });
        if (existingAdminPhone || existingProfPhone) {
            return res.json({ exists: true });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Error checking phone number:', error);
        res.status(500).json({ message: 'Error checking phone number' });
    }
}

const checkUsername = async (req, res) => {
    try {
        const existingUserUsername = await User.findOne({ username: req.params.username });
        if (existingUserUsername) {
            return res.json({
                exists: true,
                name: existingUserUsername.name,
                lastname: existingUserUsername.lastname,
                email: existingUserUsername.email,
                username: existingUserUsername.username,
                password: existingUserUsername.password,
                dateOfBirth: existingUserUsername.dateOfBirth,
                profilePicture: existingUserUsername.profilePicture,
                isEmailVerified: existingUserUsername.isEmailVerified,
                role: existingUserUsername.role,

                phoneNumber: existingUserUsername.phoneNumber,
                cinNumber: existingUserUsername.cinNumber,

                parentCinNumber: existingUserUsername.parentCinNumber,
                parentPhoneNumber: existingUserUsername.parentPhoneNumber,
                instrument: existingUserUsername.instrument,
                otherInstruments: existingUserUsername.otherInstruments,
                fatherOccupation: existingUserUsername.fatherOccupation,
                motherOccupation: existingUserUsername.motherOccupation,
                isSubscribed: existingUserUsername.isSubscribed,

                level: existingUserUsername.level,

            });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Error checking username:', error);
        res.status(500).json({ message: 'Error checking username' });
    }
}

const checkEmail = async (req, res) => {
    try {
        const existingUserEmail = await User.findOne({ email: req.params.email });
        if (existingUserEmail) {
            return res.json({
                exists: true,
                name: existingUserEmail.name,
                lastname: existingUserEmail.lastname,
                email: existingUserEmail.email,
                username: existingUserEmail.username,
                password: existingUserEmail.password,
                dateOfBirth: existingUserEmail.dateOfBirth,
                profilePicture: existingUserEmail.profilePicture,
                isEmailVerified: existingUserEmail.isEmailVerified,
                role: existingUserEmail.role,

                phoneNumber: existingUserEmail.phoneNumber,
                cinNumber: existingUserEmail.cinNumber,

                parentCinNumber: existingUserEmail.parentCinNumber,
                parentPhoneNumber: existingUserEmail.parentPhoneNumber,
                instrument: existingUserEmail.instrument,
                otherInstruments: existingUserEmail.otherInstruments,
                fatherOccupation: existingUserEmail.fatherOccupation,
                motherOccupation: existingUserEmail.motherOccupation,
                isSubscribed: existingUserEmail.isSubscribed,

                level: existingUserEmail.level,

            });
        }
        res.json({ exists: false });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ message: 'Error checking email' });
    }
}

const register = async (req, res) => {
    try {
        const { name, lastname, email, password, username } = req.body;

        if (!name || !lastname || !email || !password || !username) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        let existingClientEmail = await Client.findOne({ email });
        if (existingClientEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        let existingClientUsername = await Client.findOne({ username });
        if (existingClientUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newClient = new Client({
            name,
            lastname,
            email,
            password: hashedPassword,
            username,
            isEmailVerified: false,
            role: 'client',
            profilePicture: "https://storage.googleapis.com/elkindy.appspot.com/profile-picture-avatar-icon-vector-260nw-1760295569.jpg?GoogleAccessId=firebase-adminsdk-vw7kn%40elkindy.iam.gserviceaccount.com&Expires=16447014000&Signature=oIY%2F2HdCDuQ7cfuU4dxllQLXtfgBb3omrsDLFP9%2BxXZngComw9UlF0IpP5BpZjn9d5sBTwX9Crw%2F%2BXUicNkHJeGLu64e57sO7zR2DS77pGDnFb6858yQO663rq1ehoNxZmaamY5ZR69Rf%2FQ1XnaBMIZIMRF14fCHQm4mJG3oFeby7bnTlrkWwR1AbF9RPthvZ7aJq5ZjUQFY5uJPwzC7dsyC7wcEzTPkDuZAns8aqXfDWYuYMdrMpzQ4dyc%2BD%2FKSoJFUEbInuraCEI%2F7qqwPntq8wTa88rNPvMsT5xw7L9OEOGIuKBLtXg8s6fmDx7MkYIvIPi1BSB2qHLvzBh%2Fuqw%3D%3D",
        });
        await newClient.save();

        const payloadOne = {
            userId: newClient._id,
            role: newClient.role
        };

        const token = jwt.sign(payloadOne, process.env.JWT_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign(payloadOne, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' })

        res.cookie('token', token, { domain: 'localhost', path: '/', httpOnly: true });
        res.cookie('refreshToken', refreshToken, { domain: 'localhost', path: '/', httpOnly: true });

        res.status(201).json({ message: 'Client registered successfully', token, refreshToken });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering Client' });
    }
};


const hashVerificationCode = async (req, res) => {
    try {
        let { verificationCode } = req.body;
        if (typeof verificationCode !== 'string') {
            verificationCode = String(verificationCode);
        }
        const hashedCode = await bcrypt.hash(verificationCode, 10);
        res.status(200).json({ hashedCode });
    } catch (error) {
        console.error('Error hashing verification code:', error);
        res.status(500).json({ message: 'Error hashing verification code' });
    }
}

const compareVerificationCode = async (req, res) => {
    try {
        const { code, hashedVerificationCode } = req.body;
        const isMatch = await bcrypt.compare(code, hashedVerificationCode);
        res.status(200).json({ isMatch });
    } catch (error) {
        console.error('Error comparing verification code:', error);
        res.status(500).json({ message: 'Error comparing verification code' });
    }
}

const sendVerificationCode = async (req, res) => {
    const { email, username } = req.body;
    try {
        const generatedCode = Math.floor(10000 + Math.random() * 90000);
        const htmlTemplate = fs.readFileSync(filePathThree, 'utf8');
        const emailContent = htmlTemplate
            .replace('{{ email }}', email)
            .replace('{{ username }}', username)
            .replace('{{ verificationCode }}', generatedCode);
        const data = {
            to: email,
            subject: "Hi there! Verify your email address!",
            html: emailContent
        };
        await sendEmail(data, req, res);

        res.status(200).json({ message: 'Verification code sent successfully', verificationCode: generatedCode });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({ message: 'Error sending verification code' });
    }
}



const registerClient = async (req, res) => {
    try {
        const { name, lastname, email, password, username, dateOfBirth, profilePicture,
            parentCinNumber, parentPhoneNumber, instrument, otherInstruments, fatherOccupation, motherOccupation,

            level, verificationCode } = req.body;


        if (!name || !lastname || !email || !password || !username) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        let existingClientEmail = await Client.findOne({ email });
        if (existingClientEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        let existingClientUsername = await Client.findOne({ username });
        if (existingClientUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }




        const hashedPassword = await bcrypt.hash(password, 10);
        const newClient = new Client({
            name,
            lastname,
            email,
            password: hashedPassword,
            username,
            dateOfBirth: dateOfBirth ? dateOfBirth : "",
            profilePicture: "https://storage.googleapis.com/elkindy.appspot.com/profile-picture-avatar-icon-vector-260nw-1760295569.jpg?GoogleAccessId=firebase-adminsdk-vw7kn%40elkindy.iam.gserviceaccount.com&Expires=16447014000&Signature=oIY%2F2HdCDuQ7cfuU4dxllQLXtfgBb3omrsDLFP9%2BxXZngComw9UlF0IpP5BpZjn9d5sBTwX9Crw%2F%2BXUicNkHJeGLu64e57sO7zR2DS77pGDnFb6858yQO663rq1ehoNxZmaamY5ZR69Rf%2FQ1XnaBMIZIMRF14fCHQm4mJG3oFeby7bnTlrkWwR1AbF9RPthvZ7aJq5ZjUQFY5uJPwzC7dsyC7wcEzTPkDuZAns8aqXfDWYuYMdrMpzQ4dyc%2BD%2FKSoJFUEbInuraCEI%2F7qqwPntq8wTa88rNPvMsT5xw7L9OEOGIuKBLtXg8s6fmDx7MkYIvIPi1BSB2qHLvzBh%2Fuqw%3D%3D",
            isEmailVerified: true,

            role: 'client',


            parentPhoneNumber,
            parentCinNumber,
            instrument: instrument ? instrument : "",
            otherInstruments: otherInstruments ? otherInstruments : "",
            fatherOccupation: fatherOccupation ? fatherOccupation : "",
            motherOccupation: motherOccupation ? motherOccupation : "",
            isSubscribed: false,

            level: level ? level : "Initiation",
        });
        await newClient.save();


        const payloadClient = {
            userId: newClient._id,
            role: newClient.role
        };

        const token = jwt.sign(payloadClient, process.env.JWT_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign(payloadClient, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' })

        res.cookie('token', token, { domain: 'localhost', path: '/', httpOnly: true });
        res.cookie('refreshToken', refreshToken, { domain: 'localhost', path: '/', httpOnly: true });

        res.status(201).json({ message: 'Client registered successfully', token, refreshToken });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering Client' });
    }
};

const registerAdmin = async (req, res) => {
    try {
        const { name, lastname, email, password, username, cinNumber, phoneNumber, profilePicture, dateOfBirth } = req.body;

        if (!name || !lastname || !email || !password || !username || !cinNumber || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        if (cinNumber.length < 8) {
            return res.status(400).json({ message: 'CIN must be at least 8 characters long.' });
        }
        let existingAdminCIN = await Admin.findOne({ cinNumber });
        if (existingAdminCIN) {
            return res.status(400).json({ message: 'CIN is invalid.' });
        }
        if (phoneNumber.length < 8) {
            return res.status(400).json({ message: 'Phone number is invalid.' });
        }
        let existingAdminPhone = await Admin.findOne({ phoneNumber });
        if (existingAdminPhone) {
            return res.status(400).json({ message: 'Phone number is invalid.' });
        }
        let existingAdminEmail = await Admin.findOne({ email });
        if (existingAdminEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        let existingAdminUsername = await Admin.findOne({ username });
        if (existingAdminUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            name,
            lastname,
            email,
            password: hashedPassword,
            username,
            dateOfBirth: dateOfBirth ? dateOfBirth : "",
            profilePicture: "https://storage.googleapis.com/elkindy.appspot.com/profile-picture-avatar-icon-vector-260nw-1760295569.jpg?GoogleAccessId=firebase-adminsdk-vw7kn%40elkindy.iam.gserviceaccount.com&Expires=16447014000&Signature=oIY%2F2HdCDuQ7cfuU4dxllQLXtfgBb3omrsDLFP9%2BxXZngComw9UlF0IpP5BpZjn9d5sBTwX9Crw%2F%2BXUicNkHJeGLu64e57sO7zR2DS77pGDnFb6858yQO663rq1ehoNxZmaamY5ZR69Rf%2FQ1XnaBMIZIMRF14fCHQm4mJG3oFeby7bnTlrkWwR1AbF9RPthvZ7aJq5ZjUQFY5uJPwzC7dsyC7wcEzTPkDuZAns8aqXfDWYuYMdrMpzQ4dyc%2BD%2FKSoJFUEbInuraCEI%2F7qqwPntq8wTa88rNPvMsT5xw7L9OEOGIuKBLtXg8s6fmDx7MkYIvIPi1BSB2qHLvzBh%2Fuqw%3D%3D",
            isEmailVerified: true,
            role: 'admin',


            cinNumber,
            phoneNumber,
        });
        await newAdmin.save();

        const htmlTemplate = fs.readFileSync(filePathTwo, 'utf8');
        const emailContent = htmlTemplate
            .replace('{{ username }}', username)
            .replace('{{ email }}', email)
            .replace('{{ password }}', password);

        const data = {
            to: newAdmin.email,
            subject: "Hi there! Welcome to Elkindy!",
            html: emailContent
        };
        await sendEmail(data, req, res);

        const payloadAdmin = {
            userId: newAdmin._id,
            role: newAdmin.role
        };

        const token = jwt.sign(payloadAdmin, process.env.JWT_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign(payloadAdmin, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' })

        res.cookie('token', token, { domain: 'localhost', path: '/', httpOnly: true });
        res.cookie('refreshToken', refreshToken, { domain: 'localhost', path: '/', httpOnly: true });

        res.status(201).json({ message: 'Admin registered successfully', token, refreshToken });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering admin' });
    }
};

const registerProf = async (req, res) => {
    try {
        const { name, lastname, email, password, username, cinNumber, phoneNumber, profilePicture, dateOfBirth } = req.body;

        if (!name || !lastname || !email || !password || !username || !cinNumber || !phoneNumber) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }
        if (cinNumber.length < 8) {
            return res.status(400).json({ message: 'CIN must be at least 8 characters long.' });
        }
        let existingProfCIN = await Prof.findOne({ cinNumber });
        if (existingProfCIN) {
            return res.status(400).json({ message: 'CIN is invalid.' });
        }
        if (phoneNumber.length < 8) {
            return res.status(400).json({ message: 'Phone number is invalid.' });
        }
        let existingProfPhone = await Prof.findOne({ phoneNumber });
        if (existingProfPhone) {
            return res.status(400).json({ message: 'Phone number is invalid.' });
        }
        let existingProfEmail = await Prof.findOne({ email });
        if (existingProfEmail) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        let existingProfUsername = await Prof.findOne({ username });
        if (existingProfUsername) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newProf = new Prof({
            name,
            lastname,
            email,
            password: hashedPassword,
            username,
            dateOfBirth: dateOfBirth ? dateOfBirth : "",
            profilePicture: "https://storage.googleapis.com/elkindy.appspot.com/profile-picture-avatar-icon-vector-260nw-1760295569.jpg?GoogleAccessId=firebase-adminsdk-vw7kn%40elkindy.iam.gserviceaccount.com&Expires=16447014000&Signature=oIY%2F2HdCDuQ7cfuU4dxllQLXtfgBb3omrsDLFP9%2BxXZngComw9UlF0IpP5BpZjn9d5sBTwX9Crw%2F%2BXUicNkHJeGLu64e57sO7zR2DS77pGDnFb6858yQO663rq1ehoNxZmaamY5ZR69Rf%2FQ1XnaBMIZIMRF14fCHQm4mJG3oFeby7bnTlrkWwR1AbF9RPthvZ7aJq5ZjUQFY5uJPwzC7dsyC7wcEzTPkDuZAns8aqXfDWYuYMdrMpzQ4dyc%2BD%2FKSoJFUEbInuraCEI%2F7qqwPntq8wTa88rNPvMsT5xw7L9OEOGIuKBLtXg8s6fmDx7MkYIvIPi1BSB2qHLvzBh%2Fuqw%3D%3D",
            isEmailVerified: true,
            role: 'prof',


            cinNumber,
            phoneNumber,
        });
        await newProf.save();

        const htmlTemplate = fs.readFileSync(filePathTwo, 'utf8');
        const emailContent = htmlTemplate
            .replace('{{ username }}', username)
            .replace('{{ email }}', email)
            .replace('{{ password }}', password);

        const data = {
            to: newProf.email,
            subject: "Hi there! Welcome to Elkindy!",
            html: emailContent
        };
        await sendEmail(data, req, res);


        const payloadProf = {
            userId: newProf._id,
            role: newProf.role
        };

        const token = jwt.sign(payloadProf, process.env.JWT_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign(payloadProf, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' })

        res.cookie('token', token, { domain: 'localhost', path: '/', httpOnly: true });
        res.cookie('refreshToken', refreshToken, { domain: 'localhost', path: '/', httpOnly: true });

        res.status(201).json({ message: 'Prof registered successfully', token, refreshToken });

    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering prof' });
    }
};

const loginWithEmail = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const payload = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' })
        res.cookie('token', token, { domain: 'el-kindy-project-front-end.vercel.app', path: '/', httpOnly: true,secure:true });
        res.cookie('refreshToken', refreshToken, { domain: 'el-kindy-project-front-end.vercel.app', path: '/', httpOnly: true,secure:true });

        res.status(200).json({ message: 'Login successful', token, refreshToken });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const loginWithUsername = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const payload = {
            userId: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m' });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' })

        res.status(200).json({ message: 'Login successful', token, refreshToken });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user' });
    }
};

const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find({ role: 'admin' });
        res.status(200).json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'Error fetching admins' });
    }
};

const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({ role: 'client' });
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ message: 'Error fetching clients' });
    }
};

const getAllProfs = async (req, res) => {
    try {
        const profs = await Prof.find({ role: 'prof' });
        res.status(200).json(profs);
    } catch (error) {
        console.error('Error fetching profs:', error);
        res.status(500).json({ message: 'Error fetching profs' });
    }
};

const editAdminProf = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, lastname, email, username, password, dateOfBirth, role,
            phoneNumber, cinNumber, profilePicture
        } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (name) {
            user.name = name;
        }
        if (lastname) {
            user.lastname = lastname;
        }
        if (email) {
            user.email = email;
        }
        if (username) {
            user.username = username;
        }
        if (dateOfBirth) {
            user.dateOfBirth = dateOfBirth;
        }
        if (phoneNumber) {
            user.phoneNumber = phoneNumber;
        }
        if (cinNumber) {
            user.cinNumber = cinNumber;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (profilePicture) {
            user.profilePicture = profilePicture;
        }
        await user.save();

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
};


const editClient = async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, lastname, email, username, password, dateOfBirth, profilePicture, role,
            parentPhoneNumber, parentCinNumber, instrument, otherInstruments,
            fatherOccupation, motherOccupation, isSubscribed, level, classroom
        } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) {
            user.name = name;
        }
        if (lastname) {
            user.lastname = lastname;
        }
        if (email) {
            user.email = email;
        }
        if (username) {
            user.username = username;
        }
        if (dateOfBirth) {
            user.dateOfBirth = dateOfBirth;
        }
        if (role) {
            user.role = role;
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }
        if (profilePicture) {
            user.profilePicture = profilePicture;
        }

        if (parentCinNumber) {
            user.parentCinNumber = parentCinNumber;
        }
        if (instrument) {
            user.instrument = instrument;
        }
        if (otherInstruments) {
            user.otherInstruments = otherInstruments;
        }
        if (fatherOccupation) {
            user.fatherOccupation = fatherOccupation;
        }
        if (motherOccupation) {
            user.motherOccupation = motherOccupation;
        }
        if (level) {
            user.level = level;
        }
        if (classroom) {
            user.classroom = classroom;
        }
        if (isSubscribed) {
            user.isSubscribed = isSubscribed;
        }
        if (parentPhoneNumber) {
            user.parentPhoneNumber = parentPhoneNumber;
        }

        await user.save();

        res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



const updatePassword = async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body;
    validateMongoDbId(_id);
    const user = await User.findById(_id);
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        const updatedUser = await user.save();
        res.json(updatedUser);
    } else {
        res.json(user);
    }
}

const forgotPasswordToken = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    } else {
        try {
            const token = await user.createPasswordResetToken();
            await user.save();

            const htmlTemplate = fs.readFileSync(filePath, 'utf8');

            const resetURL = `http://localhost:3000/elkindy#/passwordReset/${token}`;
            const emailContent = htmlTemplate
                .replace('{{ username }}', user.username)
                .replace('{{ resetURL }}', resetURL);

            const data = {
                to: user.email,
                subject: "Password reset",
                html: emailContent
            };
            await sendEmail(data, req, res);
            res.status(200).json({ message: "Password reset token sent successfully" });
        } catch (error) {
            console.error('Error sending password reset token:', error);
            res.status(500).json({ message: 'Error sending password reset token' });
        }
    }
}

const resetPassword = async (req, res) => {
    const { password } = req.body;
    const resetToken = req.params.token;
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
        passwordResetToken: resetPasswordToken,
        passwordResetExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
}


const updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;
        const { subscription } = req.body;

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.subscriptionType = subscription;
        user.subscriptionDate = new Date();
        user.isSubscribed = true;
        await user.save();

        return res.json({ message: 'User subscription updated successfully' });
    } catch (error) {
        console.error('Error updating user subscription:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const cancelSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        user.instrument = '';
        user.otherInstruments = '';
        user.level = 'Initiation';
        user.parentCinNumber = 0;
        user.parentPhoneNumber = 0;
        user.fatherOccupation = '';
        user.motherOccupation = '';
        user.subscriptionType = 'Non';
        user.subscriptionDate = new Date();
        user.isSubscribed = false;
        await user.save();
    } catch (error) {
        console.error('Error canceling user subscription:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const addSubscriptionHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const { subscriptionType, subscriptionPrice } = req.body;

        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Calculate subscription end date based on subscription type and starting from subscription date
        let subscriptionEndDate = new Date();
        switch (subscriptionType) {
            case 'monthly':
                subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
                break;
            case 'yearly':
                subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
                break;
            case '6 months':
                subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 6);
                break;
            default:
                console.error('Unexpected subscriptionType:', subscriptionType);
                return res.status(400).json({ error: 'Invalid subscription type' });
        }
        const newHistorySubscription = new HistorySubscription({
            client: id,
            subscriptionType: subscriptionType,
            subscriptionDate: new Date(),
            subscriptionPrice: subscriptionPrice,
            subscriptionStatus: 'active',
            subscriptionEndDate: subscriptionEndDate
        });
        await newHistorySubscription.save();

        return res.json({ message: 'User subscription history added successfully' });
    } catch (error) {
        console.error('Error adding history subscription:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const cancelSubscriptionHistory = async (req, res) => {
    try {
        const { id } = req.params;
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Calculate subscription end date based on subscription type and starting from subscription date
        let subscriptionEndDate = new Date();
        switch (user.subscriptionType) {
            case 'monthly':
                subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);
                break;
            case 'yearly':
                subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
                break;
            case '6 months':
                subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 6);
                break;
            default:
                console.error('Unexpected subscriptionType:', user.subscriptionType);
                return res.status(400).json({ error: 'Invalid subscription type' });
        }
        let subscriptionPrice = 0;
        if (user.subscriptionType === 'monthly') {
            subscriptionPrice = 50;
        } else if (user.subscriptionType === 'yearly') {
            subscriptionPrice = 600;
        } else if (user.subscriptionType === '6 months') {
            subscriptionPrice = 300;
        } else {
            console.error('Unexpected subscriptionType:', user.subscriptionType);
            return;
        }
        const newHistorySubscription = new HistorySubscription({
            client: id,
            subscriptionType: user.subscriptionType,
            subscriptionDate: new Date(),
            subscriptionPrice: subscriptionPrice,
            subscriptionStatus: 'inactive',
            subscriptionEndDate: subscriptionEndDate
        });
        await newHistorySubscription.save();

        return res.json({ message: 'User subscription history added successfully' });
    } catch (error) {
        console.error('Error adding history subscription:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const findAllHistorySubscriptions = async (req, res) => {
    try {
        const historySubscriptions = await HistorySubscription.find();
        return res.json(historySubscriptions);
    } catch (error) {
        console.error('Error fetching history subscriptions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const findAllHistorySubscriptionByClient = async (req, res) => {
    try {
        const { id } = req.params;
        const historySubscriptions = await HistorySubscription.find({ client: id });
        return res.json(historySubscriptions);
    } catch (error) {
        console.error('Error fetching history subscriptions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


const calculateTotalIncome = async (req, res) => {
    try {
        const totalIncomeResult = await HistorySubscription.aggregate([
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$subscriptionPrice" }
                }
            }
        ]);

        const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].totalIncome : 0;
        return res.json({ TotalIncome: totalIncome });
    } catch (error) {
        console.error('Error calculating total income:', error);
        throw error;
    }
};

const calculateTotalIncomeThisMonth = async (req, res) => {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Month is zero-based, so add 1 to get the correct month

        const totalIncomeResult = await HistorySubscription.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$subscriptionDate" }, month] },
                            { $eq: [{ $year: "$subscriptionDate" }, year] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: "$subscriptionPrice" }
                }
            }
        ]);

        const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].totalIncome : 0;
        return res.json({ TotalIncomeThisMonth: totalIncome });
    } catch (error) {
        console.error('Error calculating total income:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const calculateTotalSubscriptionsThisMonth = async (req, res) => {
    try {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        // Get the total subscriptions for the current month
        const totalSubscriptionsCurrentMonth = await HistorySubscription.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$subscriptionDate" }, month] },
                            { $eq: [{ $year: "$subscriptionDate" }, year] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSubscriptions: { $sum: 1 }
                }
            }
        ]);
        const totalCurrentMonth = totalSubscriptionsCurrentMonth.length > 0 ? totalSubscriptionsCurrentMonth[0].totalSubscriptions : 0;
        // Get the total subscriptions for the previous month
        const previousMonth = month === 1 ? 12 : month - 1;
        const previousYear = month === 1 ? year - 1 : year;
        const totalSubscriptionsPreviousMonth = await HistorySubscription.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $month: "$subscriptionDate" }, previousMonth] },
                            { $eq: [{ $year: "$subscriptionDate" }, previousYear] }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSubscriptions: { $sum: 1 }
                }
            }
        ]);
        const totalPreviousMonth = totalSubscriptionsPreviousMonth.length > 0 ? totalSubscriptionsPreviousMonth[0].totalSubscriptions : 0;
        // Calculate the percentage increase
        const percentageIncrease = totalPreviousMonth !== 0 ? ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100 : 0;

        return res.json({ totalSubscriptions: totalCurrentMonth, percentageIncrease });
    } catch (error) {
        console.error('Error calculating total subscriptions:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};



const calculateTotalClients = async (req, res) => {
    try {
        const totalClientsResult = await HistorySubscription.aggregate([
            {
                $group: {
                    _id: "$client",
                }
            },
            {
                $group: {
                    _id: null,
                    totalClients: { $sum: 1 }
                }
            }
        ]);

        const totalClients = totalClientsResult.length > 0 ? totalClientsResult[0].totalClients : 0;

        return res.json({ TotalClients: totalClients });
    } catch (error) {
        console.error('Error calculating total clients:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const calculateTopClients = async (req, res) => {
    try {
        const topClientsResult = await HistorySubscription.aggregate([
            {
                $group: {
                    _id: "$client",
                    totalSubscriptions: { $sum: 1 }
                }
            },
            {
                $sort: { totalSubscriptions: -1 }
            },
            {
                $limit: 5
            }
        ]);

        return res.json({ TopClients: topClientsResult });
    } catch (error) {
        console.error('Error calculating top clients:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const calculateSubscriptionStatus = async (req, res) => {
    try {
        const subscriptionStatusResult = await HistorySubscription.aggregate([
            {
                $group: {
                    _id: "$subscriptionStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Initialize subscriptionStatus with default values
        let subscriptionStatus = { active: 0, inactive: 0 };

        // Iterate through the result and update subscriptionStatus accordingly
        subscriptionStatusResult.forEach((status) => {
            if (status._id === 'active') {
                subscriptionStatus.active = status.count;
            } else if (status._id === 'inactive') {
                subscriptionStatus.inactive = status.count;
            }
        });

        // Check if either active or inactive status is null and set count to 0 if null
        if (subscriptionStatus.active === null) {
            subscriptionStatus.active = 0;
        }
        if (subscriptionStatus.inactive === null) {
            subscriptionStatus.inactive = 0;
        }

        // Return the subscriptionStatus object in the response
        return res.json({ SubscriptionStatus: subscriptionStatus });
    } catch (error) {
        console.error('Error calculating subscription status:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const calculateSubscriptionByType = async (req, res) => {
    try {
        // Create an array containing all months (1 to 12)
        const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);

        const subscriptionByTypeResult = await HistorySubscription.aggregate([
            {
                $match: {
                    createdAt: { $exists: true, $ne: null } // Ensure createdAt field exists and is not null
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" }, // Extract the month from the createdAt field
                        subscriptionType: "$subscriptionType"
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.month", // Group by month
                    types: {
                        $push: {
                            type: "$_id.subscriptionType",
                            count: "$count"
                        }
                    }
                }
            }
        ]);

        // Create a map to store the subscription counts for each month
        const subscriptionByMonth = new Map();

        // Initialize counts for all months to 0
        allMonths.forEach(month => subscriptionByMonth.set(month, {}));

        // Populate the map with the actual counts
        subscriptionByTypeResult.forEach(result => {
            const month = result._id;
            const counts = {};
            result.types.forEach(type => counts[type.type] = type.count);
            subscriptionByMonth.set(month, counts);
        });

        // Convert the map to a plain object
        const subscriptionByMonthObject = {};
        subscriptionByMonth.forEach((value, key) => {
            subscriptionByMonthObject[key] = value;
        });

        return res.json({ subscriptionByMonth: subscriptionByMonthObject });
    } catch (error) {
        console.error('Error calculating subscription by type:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    registerClient, registerAdmin, registerProf, register,
    loginWithEmail, loginWithUsername,
    deleteUser,
    checkEmail, checkUsername, checkCINAdminProf, checkPhoneAdminProf,

    getAllAdmins, getAllClients, getAllProfs,
    editAdminProf, editClient,
    getUserById,
    resetPassword, forgotPasswordToken, updatePassword,
    sendVerificationCode, hashVerificationCode, compareVerificationCode,

    updateSubscription, cancelSubscription, addSubscriptionHistory, cancelSubscriptionHistory,
    findAllHistorySubscriptions, findAllHistorySubscriptionByClient,

    calculateTotalIncome, calculateTotalIncomeThisMonth,
    calculateTotalSubscriptionsThisMonth, calculateTotalClients, calculateTopClients,
    calculateSubscriptionStatus, calculateSubscriptionByType
}

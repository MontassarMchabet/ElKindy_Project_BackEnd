const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../Models/User');

const authMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            next();
        } catch (error) {
            console.error("Token verification error:", error);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized');
    }
});

const adminMiddleware = asyncHandler(async (req, res, next) => {
    const token = req.headers['x-access-token'];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
});

module.exports = { authMiddleware, adminMiddleware };
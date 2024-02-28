const jwt = require('jsonwebtoken')

const decodeToken = (req, res) => {
    const { token } = req.body;

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        const userId = decoded.userId;

        res.json({ userId });
    });
}

module.exports = decodeToken;
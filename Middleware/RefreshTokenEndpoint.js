const jwt = require('jsonwebtoken')

const VerifyRefreshToken = (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token missing' });
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const userId = decoded.userId;
            const accessToken = generateAccessToken(userId);

            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Error refreshing token:', error);
        res.status(500).json({ message: 'Error refreshing token' });
    }
};

module.exports = VerifyRefreshToken;
const authorizationByRole = (req, res, next) => {
    if (req.User && req.User.role == 'admin') {
        next();
    } else {
        res.staus(403).send('Unauthorized');
    }
}

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

module.exports = authenticateToken, authorizationByRole;
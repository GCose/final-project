const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (request, response, next) => {
    try {
        const authHeader = request.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return response.status(401).json({ message: 'Access token is required genius 😒' });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decode.userId).populate('role');

        if (!user || !user.isActive) {
            return response.status(401).json({ message: 'User not found or inactive, crazy stuff😂' });
        }

        request.user = user;
        next();
    } catch (error) {
        return response.status(403).json({ message: 'Invalid or expired token. Either ways, bruh☠️' });
    }
}

const authorizeRoles = (...roles) => {
    return (request, response, next) => {
        if (!request.user) {
            return response.status(401).json({ message: 'Authentication is required dude, like really?🤦‍♂️' });
        }

        if (!roles.includes(request.user.role.name)) {
            return response.status(403).json({ message: 'Insufficient permissions for this specific actions. Get them access tokens in bro.' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizeRoles
}
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

const register = async (request, response) => {
    try {
        const { fullName, email, password, roleName } = request.body;

        if (!fullName || !email || !password) {
            return response.status(400).json({ message: 'Please provide all required fields: fullName, email, and password.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({ message: "Dude, user with this email already exits." });
        }

        const role = await Role.findOne({ name: roleName || 'Viewer' });
        if (!role) {
            return response.status(400).json({ message: 'Invalid role specified. Really dude, really?😒' })
        }

        const user = await User.create({
            fullName,
            email,
            password,
            role: role._id
        }).then(user => user.populate('role'));

        const token = generateToken(user._id);

        response.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name
            }
        });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

const login = async (request, response) => {
    try {
        const { email, password } = request.body;

        const user = await User.findOne({ email }).populate('role');
        if (!user || !user.isActive) {
            return response.status(401).json({ message: 'Invalid credentials or account inactive.' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return response.status(401).json({ message: 'Invalid credentials. Do not cry' });
        }

        const token = generateToken(user._id);

        response.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
                permissions: user.role.permissions
            }
        });
    } catch (error) {
        response.status(500).json({ message: error.message, errorType: typeof error.message });
    }
}

const getCurrentUser = async (request, response) => {
    try {
        const user = await User.findById(request.user._id).populate('role');
        response.status(200).json({
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
                permissions: user.role.permissions
            }
        });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

module.exports = {
    register,
    login,
    getCurrentUser
}
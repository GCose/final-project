const User = require('../models/User');
const Role = require('../models/Role');

const getAllUsers = async (request, response) => {
    try {
        const users = await User.find({ isActive: true }).populate('role', 'name description').select('-password');
        response.status(200).json({ message: 'Users retrieved successfully. Not bad😏', users });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

const getUserById = async (request, response) => {
    try {
        const user = await User.findById(request.params.id).populate('role').select('-password');
        if (!user) {
            return response.status(404).json({ message: 'User not found. It is not as bad as it seems.' });
        }

        response.status(200).json({ message: 'User retrieved successfully.', user });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

const updateUserRole = async (request, response) => {
    try {
        const { roleName } = request.body;
        const userId = request.params.id;

        const role = await Role.findOne({ name: roleName });
        if (!role) {
            return response.status(400).json({ message: 'Invalid role specified' });
        }

        const user = await User.findByIdAndUpdate(userId, { role: role._id }, { new: true }).populate('role').select('-password');
        if (!user) {
            return response.status(404).json({ message: 'User not found. It is not the end of the world, try again.' });
        }

        response.status(200).json({ message: 'User role updated succesfully. Crazy backend stuff', user })
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

const deactivateUser = async (request, response) => {
    try {
        const user = await User.findByIdAndUpdate(request.params.id, { isActive: false }, { new: true }).select('-password');
        if (!user) {
            return response.status(404).json({ message: 'User not found.' });
        }

        response.status(200).json({ message: 'User deactivated successfully. It is not the end of the world.😒', user });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

const updateProfile = async (request, response) => {
    try {
        const { fullName, email } = request.body;
        const userId = request.user._id;

        const user = await User.findByIdAndUpdate(userId, { fullName, email }, { new: true }).populate('role').select('-password');
        response.status(200).json({ message: 'Profile updated successfully. Not bad😏', user });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    deactivateUser,
    updateProfile
}
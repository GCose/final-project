const Role = require('../models/Role');

const getAllRoles = async (_request, response) => {
    try {
        const roles = await Role.find();
        response.status(200).json({ message: 'Roles retrieved successfully', roles });
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
}

const createRole = async (request, response) => {
    try {
        const { name, permissions, description } = request.body;

        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return response.status(400).json({ message: 'Role already exists' });
        }

        const role = new Role({
            name,
            permissions,
            description
        });
        await role.save();

        response.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
}

const updateRole = async (request, response) => {
    try {
        const { permissions, description } = request.body;
        const roleId = request.params.id;

        const role = await Role.findByIdAndUpdate(roleId, { permissions, description }, { new: true, runValidators: true });
        if (!role) {
            return response.status(404).json({ message: 'Role not found' });
        }

        response.status(200).json({ message: 'Role updated successfully', role });
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
}

const deleteRole = async (request, response) => {
    try {
        const role = await Role.findByIdAndDelete(request.params.id);
        if (!role) {
            return response.status(404).json({ message: 'Role not found' });
        }

        response.status(200).json({ message: 'Role deleted successfully', role });
    } catch (error) {
        response.status(400).json({ message: error.message });
    }
}

module.exports = {
    getAllRoles,
    createRole,
    updateRole,
    deleteRole
}
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/', authenticateToken, authorizeRoles('Admin'), userController.getAllUsers);
router.get('/:id', authenticateToken, authorizeRoles('Admin'), userController.getUserById);
router.put('/:id/role', authenticateToken, authorizeRoles('Admin'), userController.updateUserRole);
router.put('/:id/deactivate', authenticateToken, authorizeRoles('Admin'), userController.deactivateUser);
router.put('/profile', authenticateToken, userController.updateProfile);

module.exports = router;
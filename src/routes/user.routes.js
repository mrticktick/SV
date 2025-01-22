const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { createUserValidation, updateUserValidation } = require('../middleware/userValidation');

// Get all users
router.get('/users', UserController.getUsers);

// Get user by ID
router.get('/users/:id', UserController.getUserById);

// Create new user
router.post('/users', createUserValidation, UserController.createUser);

// Update user
router.put('/users/:id', updateUserValidation, UserController.updateUser);

// Delete user
router.delete('/users/:id', UserController.deleteUser);

module.exports = router; 
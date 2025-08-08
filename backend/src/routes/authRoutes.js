const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rotas públicas (não precisam de autenticação)
router.post('/login', authController.login);
router.post('/register', authController.register);

// Rotas protegidas (precisam de autenticação)
router.post('/verify', authController.verifyToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
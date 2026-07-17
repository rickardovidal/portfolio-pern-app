const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rate limiting para o login (máximo 5 tentativas falhadas por IP a cada 15 minutos)
const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        message: 'Demasiadas tentativas de login. Tenta novamente dentro de 15 minutos.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Rotas públicas (não precisam de autenticação)
router.post('/login', loginRateLimit, authController.login);

// Rotas protegidas (precisam de autenticação)
router.post('/register', authenticateToken, authController.register);
router.post('/verify', authController.verifyToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;

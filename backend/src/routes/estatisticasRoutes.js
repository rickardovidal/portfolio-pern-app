const express = require('express');
const router = express.Router();
const estatisticasController = require('../controllers/EstatisticasController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas de estatísticas são protegidas
router.use(authenticateToken);

// GET /api/estatisticas - Estatísticas agregadas do negócio
router.get('/', estatisticasController.obter);

module.exports = router;

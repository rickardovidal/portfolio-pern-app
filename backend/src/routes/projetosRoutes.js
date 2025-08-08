const express = require('express');
const router = express.Router();
const projetosController = require('../controllers/ProjetosController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas de projetos são protegidas
router.use(authenticateToken);

// GET /api/projetos - Listar todos os projetos
router.get('/', projetosController.listar);

// GET /api/projetos/:id - Obter projeto por ID
router.get('/:id', projetosController.obterPorId);

// POST /api/projetos - Criar novo projeto
router.post('/', projetosController.criar);

// PUT /api/projetos/:id - Atualizar projeto
router.put('/:id', projetosController.atualizar);

// PATCH /api/projetos/:id/cancelar - Cancelar projeto (soft delete)
router.patch('/:id/cancelar', projetosController.desativar);

module.exports = router;
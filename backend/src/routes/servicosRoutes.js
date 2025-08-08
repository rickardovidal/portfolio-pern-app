const express = require('express');
const router = express.Router();
const servicosController = require('../controllers/ServicosController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas de serviços são protegidas
router.use(authenticateToken);

// GET /api/servicos - Listar todos os serviços
router.get('/', servicosController.listar);

// GET /api/servicos/:id - Obter serviço por ID
router.get('/:id', servicosController.obterPorId);

// POST /api/servicos - Criar novo serviço
router.post('/', servicosController.criar);

// PUT /api/servicos/:id - Atualizar serviço
router.put('/:id', servicosController.atualizar);

// DELETE /api/servicos/:id - Excluir serviço (soft delete)
router.delete('/:id', servicosController.excluir);

module.exports = router;
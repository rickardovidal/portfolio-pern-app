const express = require('express');
const router = express.Router();
const tiposClientesController = require('../controllers/TiposClientesController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas são protegidas
router.use(authenticateToken);

// GET /api/tipos-clientes - Listar todos os tipos de cliente
router.get('/', tiposClientesController.listar);

// GET /api/tipos-clientes/:id - Obter tipo por ID
router.get('/:id', tiposClientesController.obterPorId);

// POST /api/tipos-clientes - Criar novo tipo
router.post('/', tiposClientesController.criar);

// PUT /api/tipos-clientes/:id - Atualizar tipo
router.put('/:id', tiposClientesController.atualizar);

// DELETE /api/tipos-clientes/:id - Excluir tipo
router.delete('/:id', tiposClientesController.excluir);

module.exports = router;
const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/ClientesController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas de clientes são protegidas
router.use(authenticateToken);

// GET /api/clientes - Listar todos os clientes
router.get('/', clientesController.listar);

// GET /api/clientes/:id - Obter cliente por ID
router.get('/:id', clientesController.obterPorId);

// POST /api/clientes - Criar novo cliente
router.post('/', clientesController.criar);

// PUT /api/clientes/:id - Atualizar cliente
router.put('/:id', clientesController.atualizar);

// DELETE /api/clientes/:id - Excluir cliente (soft delete)
router.delete('/:id', clientesController.excluir);

module.exports = router;
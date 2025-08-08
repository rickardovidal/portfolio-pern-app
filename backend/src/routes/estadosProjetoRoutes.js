const express = require('express');
const router = express.Router();
const estadosProjetoController = require('../controllers/EstadosProjetoController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas são protegidas
router.use(authenticateToken);

// GET /api/estados-projeto - Listar todos os estados
router.get('/', estadosProjetoController.listar);

// GET /api/estados-projeto/:id - Obter estado por ID
router.get('/:id', estadosProjetoController.obterPorId);

// POST /api/estados-projeto - Criar novo estado
router.post('/', estadosProjetoController.criar);

// PUT /api/estados-projeto/:id - Atualizar estado
router.put('/:id', estadosProjetoController.atualizar);

// DELETE /api/estados-projeto/:id - Excluir estado
router.delete('/:id', estadosProjetoController.excluir);

module.exports = router;
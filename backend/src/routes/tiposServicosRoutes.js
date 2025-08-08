const express = require('express');
const router = express.Router();
const tiposServicosController = require('../controllers/TiposServicosController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas são protegidas
router.use(authenticateToken);

// GET /api/tipos-servicos - Listar todos os tipos de serviço
router.get('/', tiposServicosController.listar);

// GET /api/tipos-servicos/:id - Obter tipo por ID
router.get('/:id', tiposServicosController.obterPorId);

// POST /api/tipos-servicos - Criar novo tipo
router.post('/', tiposServicosController.criar);

// PUT /api/tipos-servicos/:id - Atualizar tipo
router.put('/:id', tiposServicosController.atualizar);

// DELETE /api/tipos-servicos/:id - Excluir tipo
router.delete('/:id', tiposServicosController.excluir);

module.exports = router;
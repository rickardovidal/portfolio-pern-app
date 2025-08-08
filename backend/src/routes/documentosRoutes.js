const express = require('express');
const router = express.Router();
const documentosController = require('../controllers/DocumentosController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas são protegidas
router.use(authenticateToken);

// GET /api/documentos - Listar todos os documentos
router.get('/', documentosController.listar);

// GET /api/documentos/projeto/:idProjeto - Listar documentos por projeto
router.get('/projeto/:idProjeto', documentosController.listarPorProjeto);

// GET /api/documentos/:id - Obter documento por ID
router.get('/:id', documentosController.obterPorId);

// POST /api/documentos - Criar novo documento
router.post('/', documentosController.criar);

// PUT /api/documentos/:id - Atualizar documento
router.put('/:id', documentosController.atualizar);

// DELETE /api/documentos/:id - Excluir documento
router.delete('/:id', documentosController.excluir);

module.exports = router;
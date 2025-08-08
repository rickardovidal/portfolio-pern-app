const express = require('express');
const router = express.Router();
const faturasController = require('../controllers/FaturasController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas são protegidas
router.use(authenticateToken);

// GET /api/faturas - Listar todas as faturas
router.get('/', faturasController.listar);

// GET /api/faturas/projeto/:idProjeto - Listar faturas por projeto
router.get('/projeto/:idProjeto', faturasController.listarPorProjeto);

// GET /api/faturas/:id - Obter fatura por ID
router.get('/:id', faturasController.obterPorId);

// POST /api/faturas - Criar nova fatura
router.post('/', faturasController.criar);

// PUT /api/faturas/:id - Atualizar fatura
router.put('/:id', faturasController.atualizar);

// DELETE /api/faturas/:id - Excluir fatura
router.delete('/:id', faturasController.excluir);

module.exports = router;
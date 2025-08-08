const express = require('express');
const router = express.Router();
const utilizadoresController = require('../controllers/UtilizadorController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas de utilizadores são protegidas
router.use(authenticateToken);

// GET /api/utilizadores - Listar todos os utilizadores
router.get('/', utilizadoresController.listar);

// GET /api/utilizadores/:id - Obter utilizador por ID
router.get('/:id', utilizadoresController.obterPorId);

// POST /api/utilizadores - Criar novo utilizador
router.post('/', utilizadoresController.criar);

// PUT /api/utilizadores/:id - Atualizar utilizador
router.put('/:id', utilizadoresController.atualizar);

// PUT /api/utilizadores/:id/password - Alterar password
router.put('/:id/password', utilizadoresController.alterarPassword);

// DELETE /api/utilizadores/:id - Excluir utilizador
router.delete('/:id', utilizadoresController.excluir);

module.exports = router;
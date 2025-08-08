const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/TarefasController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas são protegidas
router.use(authenticateToken);

// GET /api/tarefas - Listar todas as tarefas
router.get('/', tarefasController.listar);

// GET /api/tarefas/projeto/:idProjeto - Listar tarefas por projeto
router.get('/projeto/:idProjeto', tarefasController.listarPorProjeto);

// GET /api/tarefas/:id - Obter tarefa por ID
router.get('/:id', tarefasController.obterPorId);

// POST /api/tarefas - Criar nova tarefa
router.post('/', tarefasController.criar);

// PUT /api/tarefas/:id - Atualizar tarefa
router.put('/:id', tarefasController.atualizar);

// PATCH /api/tarefas/:id/concluir - Marcar tarefa como concluída
router.patch('/:id/concluir', tarefasController.concluir);

// DELETE /api/tarefas/:id - Excluir tarefa
router.delete('/:id', tarefasController.excluir);

module.exports = router;
const express = require('express');
const router = express.Router();
const projetosServicosController = require('../controllers/ProjetosServicosController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas são protegidas
router.use(authenticateToken);

// GET /api/projetos-servicos - Listar todas as associações projeto-serviço
router.get('/', projetosServicosController.listar);

// GET /api/projetos-servicos/projeto/:idProjeto - Listar serviços de um projeto específico
router.get('/projeto/:idProjeto', projetosServicosController.listarPorProjeto);

// GET /api/projetos-servicos/:id - Obter associação por ID
router.get('/:id', projetosServicosController.obterPorId);

// POST /api/projetos-servicos - Associar serviço a projeto
router.post('/', projetosServicosController.criar);

// PUT /api/projetos-servicos/:id - Atualizar associação
router.put('/:id', projetosServicosController.atualizar);

// DELETE /api/projetos-servicos/:id - Remover associação
router.delete('/:id', projetosServicosController.excluir);

module.exports = router;
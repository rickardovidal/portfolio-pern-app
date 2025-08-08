const express = require('express');
const router = express.Router();
const pagamentosController = require('../controllers/PagamentosController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Todas as rotas são protegidas
router.use(authenticateToken);

// GET /api/pagamentos - Listar todos os pagamentos
router.get('/', pagamentosController.listar);

// GET /api/pagamentos/fatura/:idFatura - Listar pagamentos por fatura
router.get('/fatura/:idFatura', pagamentosController.listarPorFatura);

// GET /api/pagamentos/:id - Obter pagamento por ID
router.get('/:id', pagamentosController.obterPorId);

// POST /api/pagamentos - Criar novo pagamento
router.post('/', pagamentosController.criar);

// PUT /api/pagamentos/:id - Atualizar pagamento
router.put('/:id', pagamentosController.atualizar);

// DELETE /api/pagamentos/:id - Excluir pagamento
router.delete('/:id', pagamentosController.excluir);

module.exports = router;
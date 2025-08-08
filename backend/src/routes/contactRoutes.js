// src/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/ContactController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Rate limiting para prevenir spam (apenas instalamos se necessário)
let rateLimit;
try {
    rateLimit = require('express-rate-limit');
} catch (e) {
    // Se não estiver instalado, funciona sem rate limiting
    rateLimit = null;
}

// Rate limiting para formulário de contacto (máximo 5 mensagens por hora por IP)
const contactRateLimit = rateLimit ? rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // máximo 5 requests por hora
    message: {
        success: false,
        message: 'Muitas mensagens enviadas. Tenta novamente em 1 hora.'
    },
    standardHeaders: true,
    legacyHeaders: false,
}) : (req, res, next) => next(); // Se não tiver rate-limit, passa sem fazer nada

// ROTAS PÚBLICAS (sem autenticação)

// POST /api/contact - Enviar nova mensagem de contacto
router.post('/', contactRateLimit, contactController.criar);

// ROTAS ADMINISTRATIVAS (protegidas com autenticação)

// GET /api/contact/admin - Listar mensagens
router.get('/admin', authenticateToken, contactController.listar);

// GET /api/contact/admin/:id - Obter mensagem por ID
router.get('/admin/:id', authenticateToken, contactController.obterPorId);

// PUT /api/contact/admin/:id - Actualizar status da mensagem
router.put('/admin/:id', authenticateToken, contactController.atualizar);

// PATCH /api/contact/admin/:id/read - Marcar mensagem como lida
router.patch('/admin/:id/read', authenticateToken, contactController.marcarComoLida);

// DELETE /api/contact/admin/:id - Arquivar mensagem (soft delete)
router.delete('/admin/:id', authenticateToken, contactController.excluir);

// GET /api/contact/admin/stats - Estatísticas básicas (opcional)
router.get('/admin/stats', authenticateToken, async (req, res) => {
    try {
        const ContactMessages = require('../models/ContactMessages');
        const { Op } = require('sequelize');
        
        // Total de mensagens
        const totalMessages = await ContactMessages.count();
        
        // Mensagens não lidas
        const unreadMessages = await ContactMessages.count({
            where: { status: 'novo' }
        });

        // Mensagens dos últimos 30 dias
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentMessages = await ContactMessages.count({
            where: {
                createdAt: {
                    [Op.gte]: thirtyDaysAgo
                }
            }
        });

        res.json({
            success: true,
            data: {
                totalMessages,
                unreadMessages,
                recentMessages,
                responseRate: totalMessages > 0 ? 
                    Math.round(((totalMessages - unreadMessages) / totalMessages) * 100) : 0
            }
        });

    } catch (error) {
        console.error('Erro ao buscar estatísticas de contacto:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
});

module.exports = router;
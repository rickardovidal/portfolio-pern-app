const jwt = require('jsonwebtoken');
const Utilizador = require('../models/Utilizador');

// Middleware para verificar autenticação
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acesso requerido'
            });
        }

        // Verificar e descodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar se o utilizador ainda existe
        const user = await Utilizador.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Utilizador não encontrado'
            });
        }

        // Adicionar informações do utilizador ao request
        req.user = {
            id: user.idUtilizador,
            username: user.username,
            email: user.email
        };

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({
                success: false,
                message: 'Token inválido'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({
                success: false,
                message: 'Token expirado'
            });
        }

        console.error('Erro no middleware de autenticação:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor'
        });
    }
};

// Middleware opcional - só para desenvolvimento/debug
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token && process.env.JWT_SECRET) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_aqui');
            const user = await Utilizador.findByPk(decoded.id);
            
            if (user) {
                req.user = {
                    id: user.idUtilizador,
                    username: user.username,
                    email: user.email
                };
            }
        }

        next();
    } catch (error) {
        // Em caso de erro, continua sem autenticação
        next();
    }
};

module.exports = {
    authenticateToken,
    optionalAuth
};
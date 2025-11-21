const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); // ADICIONADO PARA CORRIGIR O ERRO
const Utilizador = require('../models/Utilizador');

const authController = {
    
    // Login do utilizador
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validação básica
            if (!username || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username e password são obrigatórios'
                });
            }

            // Procurar utilizador
            const user = await Utilizador.findOne({
                where: { username: username }
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Verificar password
            const isValidPassword = user.validPassword(password);
            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciais inválidas'
                });
            }

            // Verificar se JWT_SECRET está configurado
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET não está configurado nas variáveis de ambiente');
                return res.status(500).json({
                    success: false,
                    message: 'Erro de configuração do servidor'
                });
            }

            // Gerar JWT token
            const token = jwt.sign(
                { 
                    id: user.idUtilizador, 
                    username: user.username,
                    email: user.email 
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'Login realizado com sucesso',
                token: token,
                user: {
                    id: user.idUtilizador,
                    username: user.username,
                    email: user.email
                }
            });

        } catch (error) {
            console.error('Erro no login:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Verificar se o token é válido
    verifyToken: async (req, res) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token não fornecido'
                });
            }

            // Verificar se JWT_SECRET está configurado
            if (!process.env.JWT_SECRET) {
                console.error('JWT_SECRET não está configurado nas variáveis de ambiente');
                return res.status(500).json({
                    success: false,
                    message: 'Erro de configuração do servidor'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verificar se o utilizador ainda existe
            const user = await Utilizador.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Utilizador não encontrado'
                });
            }

            res.json({
                success: true,
                message: 'Token válido',
                user: {
                    id: user.idUtilizador,
                    username: user.username,
                    email: user.email
                }
            });

        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido'
                });
            }
            
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    message: 'Token expirado'
                });
            }

            console.error('Erro na verificação do token:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Logout (opcional - principalmente para invalidar token no frontend)
    logout: async (req, res) => {
        try {
            // Como JWT é stateless, o logout é feito no frontend removendo o token
            // Aqui só confirmamos o logout
            res.json({
                success: true,
                message: 'Logout realizado com sucesso'
            });
        } catch (error) {
            console.error('Erro no logout:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Registar novo utilizador (para criar utilizadores administrativos)
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Validação básica
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username, email e password são obrigatórios'
                });
            }

            // Verificar se já existe utilizador com este username ou email
            // CORRIGIDO: Usar Op.or em vez de $or
            const existingUser = await Utilizador.findOne({
                where: {
                    [Op.or]: [
                        { username: username },
                        { email: email }
                    ]
                }
            });

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: 'Username ou email já existem'
                });
            }

            // Criar novo utilizador
            const newUser = await Utilizador.create({
                username,
                email,
                password // A password será automaticamente encriptada pelo model
            });

            res.status(201).json({
                success: true,
                message: 'Utilizador criado com sucesso',
                user: {
                    id: newUser.idUtilizador,
                    username: newUser.username,
                    email: newUser.email
                }
            });

        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({
                    success: false,
                    message: 'Dados inválidos',
                    errors: error.errors.map(err => err.message)
                });
            }

            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({
                    success: false,
                    message: 'Username ou email já existem'
                });
            }

            console.error('Erro no registo:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
}

module.exports = authController;
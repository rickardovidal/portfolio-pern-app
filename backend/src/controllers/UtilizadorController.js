const Utilizador = require('../models/Utilizador');

const utilizadoresController = {
    
    // Listar todos os utilizadores (sem password)
    listar: async (req, res) => {
        try {
            const utilizadores = await Utilizador.findAll({
                attributes: { exclude: ['password'] }
            });

            res.json({
                success: true,
                data: utilizadores
            });

        } catch (error) {
            console.error('Erro ao listar utilizadores:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter utilizador por ID (sem password)
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const utilizador = await Utilizador.findByPk(id, {
                attributes: { exclude: ['password'] }
            });

            if (!utilizador) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilizador não encontrado'
                });
            }

            res.json({
                success: true,
                data: utilizador
            });

        } catch (error) {
            console.error('Erro ao obter utilizador:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar novo utilizador
    criar: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Validação básica
            if (!username || !email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Username, email e password são obrigatórios'
                });
            }

            const novoUtilizador = await Utilizador.create({
                username,
                email,
                password
            });

            // Retornar sem a password
            const utilizadorSemPassword = {
                idUtilizador: novoUtilizador.idUtilizador,
                username: novoUtilizador.username,
                email: novoUtilizador.email,
                createdAt: novoUtilizador.createdAt,
                updatedAt: novoUtilizador.updatedAt
            };

            res.status(201).json({
                success: true,
                message: 'Utilizador criado com sucesso',
                data: utilizadorSemPassword
            });

        } catch (error) {
            console.error('Erro ao criar utilizador:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar utilizador (sem password)
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { username, email } = req.body;

            const utilizador = await Utilizador.findByPk(id);

            if (!utilizador) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilizador não encontrado'
                });
            }

            await utilizador.update({
                username,
                email
            });

            // Retornar sem a password
            const utilizadorSemPassword = {
                idUtilizador: utilizador.idUtilizador,
                username: utilizador.username,
                email: utilizador.email,
                createdAt: utilizador.createdAt,
                updatedAt: utilizador.updatedAt
            };

            res.json({
                success: true,
                message: 'Utilizador atualizado com sucesso',
                data: utilizadorSemPassword
            });

        } catch (error) {
            console.error('Erro ao atualizar utilizador:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Alterar password
    alterarPassword: async (req, res) => {
        try {
            const { id } = req.params;
            const { passwordAtual, novaPassword } = req.body;

            if (!passwordAtual || !novaPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Password atual e nova password são obrigatórias'
                });
            }

            const utilizador = await Utilizador.findByPk(id);

            if (!utilizador) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilizador não encontrado'
                });
            }

            // Verificar password atual
            const passwordValida = utilizador.validPassword(passwordAtual);
            if (!passwordValida) {
                return res.status(401).json({
                    success: false,
                    message: 'Password atual incorreta'
                });
            }

            // Atualizar com nova password (será encriptada automaticamente pelo model)
            await utilizador.update({
                password: novaPassword
            });

            res.json({
                success: true,
                message: 'Password alterada com sucesso'
            });

        } catch (error) {
            console.error('Erro ao alterar password:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Excluir utilizador
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const utilizador = await Utilizador.findByPk(id);

            if (!utilizador) {
                return res.status(404).json({
                    success: false,
                    message: 'Utilizador não encontrado'
                });
            }

            await utilizador.destroy();

            res.json({
                success: true,
                message: 'Utilizador excluído com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir utilizador:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = utilizadoresController;
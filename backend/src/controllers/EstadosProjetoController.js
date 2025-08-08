const Estados_Projeto = require('../models/Estados_Projeto');

const estadosProjetoController = {
    
    // Listar todos os estados de projeto
    listar: async (req, res) => {
        try {
            const estados = await Estados_Projeto.findAll();

            res.json({
                success: true,
                data: estados
            });

        } catch (error) {
            console.error('Erro ao listar estados de projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter estado por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const estado = await Estados_Projeto.findByPk(id);

            if (!estado) {
                return res.status(404).json({
                    success: false,
                    message: 'Estado não encontrado'
                });
            }

            res.json({
                success: true,
                data: estado
            });

        } catch (error) {
            console.error('Erro ao obter estado:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar novo estado
    criar: async (req, res) => {
        try {
            const { designacaoEstado_Projeto } = req.body;

            if (!designacaoEstado_Projeto) {
                return res.status(400).json({
                    success: false,
                    message: 'Designação do estado é obrigatória'
                });
            }

            const novoEstado = await Estados_Projeto.create({
                designacaoEstado_Projeto
            });

            res.status(201).json({
                success: true,
                message: 'Estado criado com sucesso',
                data: novoEstado
            });

        } catch (error) {
            console.error('Erro ao criar estado:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar estado
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { designacaoEstado_Projeto } = req.body;

            const estado = await Estados_Projeto.findByPk(id);

            if (!estado) {
                return res.status(404).json({
                    success: false,
                    message: 'Estado não encontrado'
                });
            }

            await estado.update({
                designacaoEstado_Projeto
            });

            res.json({
                success: true,
                message: 'Estado atualizado com sucesso',
                data: estado
            });

        } catch (error) {
            console.error('Erro ao atualizar estado:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Excluir estado
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const estado = await Estados_Projeto.findByPk(id);

            if (!estado) {
                return res.status(404).json({
                    success: false,
                    message: 'Estado não encontrado'
                });
            }

            await estado.destroy();

            res.json({
                success: true,
                message: 'Estado excluído com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir estado:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = estadosProjetoController;
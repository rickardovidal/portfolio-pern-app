const Tipos_Servicos = require('../models/tipos_servicos');

const tiposServicosController = {
    
    // Listar todos os tipos de serviço
    listar: async (req, res) => {
        try {
            const tipos = await Tipos_Servicos.findAll();

            res.json({
                success: true,
                data: tipos
            });

        } catch (error) {
            console.error('Erro ao listar tipos de serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter tipo por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const tipo = await Tipos_Servicos.findByPk(id);

            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de serviço não encontrado'
                });
            }

            res.json({
                success: true,
                data: tipo
            });

        } catch (error) {
            console.error('Erro ao obter tipo de serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar novo tipo
    criar: async (req, res) => {
        try {
            const { designacao, descricao } = req.body;

            if (!designacao) {
                return res.status(400).json({
                    success: false,
                    message: 'Designação do tipo é obrigatória'
                });
            }

            const novoTipo = await Tipos_Servicos.create({
                designacao,
                descricao
            });

            res.status(201).json({
                success: true,
                message: 'Tipo de serviço criado com sucesso',
                data: novoTipo
            });

        } catch (error) {
            console.error('Erro ao criar tipo de serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar tipo
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { designacao, descricao } = req.body;

            const tipo = await Tipos_Servicos.findByPk(id);

            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de serviço não encontrado'
                });
            }

            await tipo.update({
                designacao,
                descricao
            });

            res.json({
                success: true,
                message: 'Tipo de serviço atualizado com sucesso',
                data: tipo
            });

        } catch (error) {
            console.error('Erro ao atualizar tipo de serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Excluir tipo
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const tipo = await Tipos_Servicos.findByPk(id);

            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de serviço não encontrado'
                });
            }

            await tipo.destroy();

            res.json({
                success: true,
                message: 'Tipo de serviço excluído com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir tipo de serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = tiposServicosController;
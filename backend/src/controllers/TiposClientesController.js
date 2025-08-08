const Tipos_Clientes = require('../models/Tipos_Clientes');

const tiposClientesController = {
    
    // Listar todos os tipos de cliente
    listar: async (req, res) => {
        try {
            const tipos = await Tipos_Clientes.findAll();

            res.json({
                success: true,
                data: tipos
            });

        } catch (error) {
            console.error('Erro ao listar tipos de cliente:', error);
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

            const tipo = await Tipos_Clientes.findByPk(id);

            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de cliente não encontrado'
                });
            }

            res.json({
                success: true,
                data: tipo
            });

        } catch (error) {
            console.error('Erro ao obter tipo de cliente:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar novo tipo
    criar: async (req, res) => {
        try {
            const { designacaoTipo_cliente } = req.body;

            if (!designacaoTipo_cliente) {
                return res.status(400).json({
                    success: false,
                    message: 'Designação do tipo é obrigatória'
                });
            }

            const novoTipo = await Tipos_Clientes.create({
                designacaoTipo_cliente
            });

            res.status(201).json({
                success: true,
                message: 'Tipo de cliente criado com sucesso',
                data: novoTipo
            });

        } catch (error) {
            console.error('Erro ao criar tipo de cliente:', error);
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
            const { designacaoTipo_cliente } = req.body;

            const tipo = await Tipos_Clientes.findByPk(id);

            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de cliente não encontrado'
                });
            }

            await tipo.update({
                designacaoTipo_cliente
            });

            res.json({
                success: true,
                message: 'Tipo de cliente atualizado com sucesso',
                data: tipo
            });

        } catch (error) {
            console.error('Erro ao atualizar tipo de cliente:', error);
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

            const tipo = await Tipos_Clientes.findByPk(id);

            if (!tipo) {
                return res.status(404).json({
                    success: false,
                    message: 'Tipo de cliente não encontrado'
                });
            }

            await tipo.destroy();

            res.json({
                success: true,
                message: 'Tipo de cliente excluído com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir tipo de cliente:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = tiposClientesController;
const Servicos = require('../models/Servicos');
const Tipos_Servicos = require('../models/tipos_servicos');

const servicosController = {
    
    // Listar todos os serviços ativos
    listar: async (req, res) => {
        try {
            const servicos = await Servicos.findAll({
                where: { ativo: true },
                include: [{
                    model: Tipos_Servicos,
                    as: 'tipo'
                }]
            });

            res.json({
                success: true,
                data: servicos
            });

        } catch (error) {
            console.error('Erro ao listar serviços:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter serviço por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const servico = await Servicos.findOne({
                where: { 
                    idServico: id,
                    ativo: true 
                },
                include: [{
                    model: Tipos_Servicos,
                    as: 'tipo'
                }]
            });

            if (!servico) {
                return res.status(404).json({
                    success: false,
                    message: 'Serviço não encontrado'
                });
            }

            res.json({
                success: true,
                data: servico
            });

        } catch (error) {
            console.error('Erro ao obter serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar novo serviço
    criar: async (req, res) => {
        try {
            const { 
                designacao_servico, 
                descricao_Servico, 
                preco_base_servico, 
                custo_servico, 
                horas_estimadas, 
                idTipo_Servico 
            } = req.body;

            // Validação básica
            if (!designacao_servico || !preco_base_servico || !custo_servico || !idTipo_Servico) {
                return res.status(400).json({
                    success: false,
                    message: 'Designação, preço base, custo e tipo de serviço são obrigatórios'
                });
            }

            const novoServico = await Servicos.create({
                designacao_servico,
                descricao_Servico,
                preco_base_servico,
                custo_servico,
                horas_estimadas,
                idTipo_Servico,
                ativo: true
            });

            res.status(201).json({
                success: true,
                message: 'Serviço criado com sucesso',
                data: novoServico
            });

        } catch (error) {
            console.error('Erro ao criar serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar serviço
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                designacao_servico, 
                descricao_Servico, 
                preco_base_servico, 
                custo_servico, 
                horas_estimadas, 
                idTipo_Servico 
            } = req.body;

            const servico = await Servicos.findOne({
                where: { 
                    idServico: id,
                    ativo: true 
                }
            });

            if (!servico) {
                return res.status(404).json({
                    success: false,
                    message: 'Serviço não encontrado'
                });
            }

            await servico.update({
                designacao_servico,
                descricao_Servico,
                preco_base_servico,
                custo_servico,
                horas_estimadas,
                idTipo_Servico
            });

            res.json({
                success: true,
                message: 'Serviço atualizado com sucesso',
                data: servico
            });

        } catch (error) {
            console.error('Erro ao atualizar serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Soft delete - desativar serviço
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const servico = await Servicos.findOne({
                where: { 
                    idServico: id,
                    ativo: true 
                }
            });

            if (!servico) {
                return res.status(404).json({
                    success: false,
                    message: 'Serviço não encontrado'
                });
            }

            await servico.update({ ativo: false });

            res.json({
                success: true,
                message: 'Serviço excluído com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = servicosController;
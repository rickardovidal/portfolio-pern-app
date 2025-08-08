const Projetos_Servicos = require('../models/Projetos_servicos');
const Projetos = require('../models/Projetos');
const Servicos = require('../models/Servicos');

const projetosServicosController = {
    
    // Listar todas as associações projeto-serviço
    listar: async (req, res) => {
        try {
            const projetosServicos = await Projetos_Servicos.findAll({
                include: [
                    {
                        model: Projetos,
                        as: 'projeto'
                    },
                    {
                        model: Servicos,
                        as: 'servico'
                    }
                ]
            });

            res.json({
                success: true,
                data: projetosServicos
            });

        } catch (error) {
            console.error('Erro ao listar projetos-serviços:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Listar serviços de um projeto específico
    listarPorProjeto: async (req, res) => {
        try {
            const { idProjeto } = req.params;

            const projetosServicos = await Projetos_Servicos.findAll({
                where: { idProjeto },
                include: [
                    {
                        model: Projetos,
                        as: 'projeto'
                    },
                    {
                        model: Servicos,
                        as: 'servico'
                    }
                ]
            });

            res.json({
                success: true,
                data: projetosServicos
            });

        } catch (error) {
            console.error('Erro ao listar serviços do projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter associação por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const projetoServico = await Projetos_Servicos.findByPk(id, {
                include: [
                    {
                        model: Projetos,
                        as: 'projeto'
                    },
                    {
                        model: Servicos,
                        as: 'servico'
                    }
                ]
            });

            if (!projetoServico) {
                return res.status(404).json({
                    success: false,
                    message: 'Associação projeto-serviço não encontrada'
                });
            }

            res.json({
                success: true,
                data: projetoServico
            });

        } catch (error) {
            console.error('Erro ao obter projeto-serviço:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Associar serviço a projeto
    criar: async (req, res) => {
        try {
            const { idProjeto, idServico, quantidade, preco_unitario } = req.body;

            // Validação básica
            if (!idProjeto || !idServico || !quantidade || !preco_unitario) {
                return res.status(400).json({
                    success: false,
                    message: 'Projeto, serviço, quantidade e preço unitário são obrigatórios'
                });
            }

            // Calcular preço total
            const preco_total = quantidade * preco_unitario;

            const novaAssociacao = await Projetos_Servicos.create({
                idProjeto,
                idServico,
                quantidade,
                preco_unitario,
                preco_total
            });

            res.status(201).json({
                success: true,
                message: 'Serviço associado ao projeto com sucesso',
                data: novaAssociacao
            });

        } catch (error) {
            console.error('Erro ao associar serviço ao projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar associação
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { quantidade, preco_unitario } = req.body;

            const projetoServico = await Projetos_Servicos.findByPk(id);

            if (!projetoServico) {
                return res.status(404).json({
                    success: false,
                    message: 'Associação projeto-serviço não encontrada'
                });
            }

            // Calcular novo preço total se necessário
            const novaQuantidade = quantidade || projetoServico.quantidade;
            const novoPrecoUnitario = preco_unitario || projetoServico.preco_unitario;
            const preco_total = novaQuantidade * novoPrecoUnitario;

            await projetoServico.update({
                quantidade: novaQuantidade,
                preco_unitario: novoPrecoUnitario,
                preco_total
            });

            res.json({
                success: true,
                message: 'Associação atualizada com sucesso',
                data: projetoServico
            });

        } catch (error) {
            console.error('Erro ao atualizar associação:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Remover associação
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const projetoServico = await Projetos_Servicos.findByPk(id);

            if (!projetoServico) {
                return res.status(404).json({
                    success: false,
                    message: 'Associação projeto-serviço não encontrada'
                });
            }

            await projetoServico.destroy();

            res.json({
                success: true,
                message: 'Serviço removido do projeto com sucesso'
            });

        } catch (error) {
            console.error('Erro ao remover associação:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = projetosServicosController;
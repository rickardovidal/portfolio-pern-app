const Pagamentos = require('../models/Pagamentos');
const Faturas = require('../models/Faturas');

const pagamentosController = {
    
    // Listar todos os pagamentos
    listar: async (req, res) => {
        try {
            const pagamentos = await Pagamentos.findAll({
                include: [{
                    model: Faturas,
                    as: 'fatura'
                }]
            });

            res.json({
                success: true,
                data: pagamentos
            });

        } catch (error) {
            console.error('Erro ao listar pagamentos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Listar pagamentos por fatura
    listarPorFatura: async (req, res) => {
        try {
            const { idFatura } = req.params;

            const pagamentos = await Pagamentos.findAll({
                where: { idFatura },
                include: [{
                    model: Faturas,
                    as: 'fatura'
                }]
            });

            res.json({
                success: true,
                data: pagamentos
            });

        } catch (error) {
            console.error('Erro ao listar pagamentos por fatura:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter pagamento por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const pagamento = await Pagamentos.findByPk(id, {
                include: [{
                    model: Faturas,
                    as: 'fatura'
                }]
            });

            if (!pagamento) {
                return res.status(404).json({
                    success: false,
                    message: 'Pagamento não encontrado'
                });
            }

            res.json({
                success: true,
                data: pagamento
            });

        } catch (error) {
            console.error('Erro ao obter pagamento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar novo pagamento
    criar: async (req, res) => {
        try {
            const { 
                valorPagamento, 
                dataPagamento, 
                metodo_pagamento, 
                notas, 
                idFatura 
            } = req.body;

            // Validação básica
            if (!valorPagamento || !dataPagamento || !idFatura) {
                return res.status(400).json({
                    success: false,
                    message: 'Valor, data de pagamento e fatura são obrigatórios'
                });
            }

            const novoPagamento = await Pagamentos.create({
                valorPagamento,
                dataPagamento,
                metodo_pagamento,
                notas,
                idFatura
            });

            res.status(201).json({
                success: true,
                message: 'Pagamento registado com sucesso',
                data: novoPagamento
            });

        } catch (error) {
            console.error('Erro ao criar pagamento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar pagamento
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                valorPagamento, 
                dataPagamento, 
                metodo_pagamento, 
                notas 
            } = req.body;

            const pagamento = await Pagamentos.findByPk(id);

            if (!pagamento) {
                return res.status(404).json({
                    success: false,
                    message: 'Pagamento não encontrado'
                });
            }

            await pagamento.update({
                valorPagamento,
                dataPagamento,
                metodo_pagamento,
                notas
            });

            res.json({
                success: true,
                message: 'Pagamento atualizado com sucesso',
                data: pagamento
            });

        } catch (error) {
            console.error('Erro ao atualizar pagamento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Excluir pagamento
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const pagamento = await Pagamentos.findByPk(id);

            if (!pagamento) {
                return res.status(404).json({
                    success: false,
                    message: 'Pagamento não encontrado'
                });
            }

            await pagamento.destroy();

            res.json({
                success: true,
                message: 'Pagamento excluído com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir pagamento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = pagamentosController;
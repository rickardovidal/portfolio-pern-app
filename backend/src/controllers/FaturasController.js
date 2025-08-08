const Faturas = require('../models/Faturas');
const Projetos = require('../models/Projetos');

const faturasController = {
    
    // Listar todas as faturas
    listar: async (req, res) => {
        try {
            const faturas = await Faturas.findAll({
                include: [{
                    model: Projetos,
                    as: 'projeto'
                }]
            });

            res.json({
                success: true,
                data: faturas
            });

        } catch (error) {
            console.error('Erro ao listar faturas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Listar faturas por projeto
    listarPorProjeto: async (req, res) => {
        try {
            const { idProjeto } = req.params;

            const faturas = await Faturas.findAll({
                where: { idProjeto },
                include: [{
                    model: Projetos,
                    as: 'projeto'
                }]
            });

            res.json({
                success: true,
                data: faturas
            });

        } catch (error) {
            console.error('Erro ao listar faturas por projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter fatura por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const fatura = await Faturas.findByPk(id, {
                include: [{
                    model: Projetos,
                    as: 'projeto'
                }]
            });

            if (!fatura) {
                return res.status(404).json({
                    success: false,
                    message: 'Fatura não encontrada'
                });
            }

            res.json({
                success: true,
                data: fatura
            });

        } catch (error) {
            console.error('Erro ao obter fatura:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar nova fatura
    criar: async (req, res) => {
        try {
            const { 
                numeroFatura, 
                dataEmissao, 
                dataVencimento, 
                subTotal, 
                taxa_iva, 
                notas, 
                idProjeto 
            } = req.body;

            // Validação básica
            if (!numeroFatura || !dataEmissao || !dataVencimento || !subTotal || !taxa_iva || !idProjeto) {
                return res.status(400).json({
                    success: false,
                    message: 'Número, datas, subtotal, taxa IVA e projeto são obrigatórios'
                });
            }

            // Calcular valor do IVA e total
            const valor_iva = (subTotal * taxa_iva) / 100;
            const total_fatura = parseFloat(subTotal) + parseFloat(valor_iva);

            const novaFatura = await Faturas.create({
                numeroFatura,
                dataEmissao,
                dataVencimento,
                subTotal,
                taxa_iva,
                valor_iva,
                total_fatura,
                notas,
                idProjeto
            });

            res.status(201).json({
                success: true,
                message: 'Fatura criada com sucesso',
                data: novaFatura
            });

        } catch (error) {
            console.error('Erro ao criar fatura:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar fatura
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                numeroFatura, 
                dataEmissao, 
                dataVencimento, 
                subTotal, 
                taxa_iva, 
                notas 
            } = req.body;

            const fatura = await Faturas.findByPk(id);

            if (!fatura) {
                return res.status(404).json({
                    success: false,
                    message: 'Fatura não encontrada'
                });
            }

            // Recalcular valores se subtotal ou taxa IVA mudaram
            const novoSubTotal = subTotal || fatura.subTotal;
            const novaTaxaIva = taxa_iva || fatura.taxa_iva;
            const valor_iva = (novoSubTotal * novaTaxaIva) / 100;
            const total_fatura = parseFloat(novoSubTotal) + parseFloat(valor_iva);

            await fatura.update({
                numeroFatura,
                dataEmissao,
                dataVencimento,
                subTotal: novoSubTotal,
                taxa_iva: novaTaxaIva,
                valor_iva,
                total_fatura,
                notas
            });

            res.json({
                success: true,
                message: 'Fatura atualizada com sucesso',
                data: fatura
            });

        } catch (error) {
            console.error('Erro ao atualizar fatura:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Excluir fatura
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const fatura = await Faturas.findByPk(id);

            if (!fatura) {
                return res.status(404).json({
                    success: false,
                    message: 'Fatura não encontrada'
                });
            }

            await fatura.destroy();

            res.json({
                success: true,
                message: 'Fatura excluída com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir fatura:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = faturasController;
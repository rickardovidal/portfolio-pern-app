const Documentos = require('../models/Documentos');
const Projetos = require('../models/Projetos');
const Faturas = require('../models/Faturas');

const documentosController = {
    
    // Listar todos os documentos
    listar: async (req, res) => {
        try {
            const documentos = await Documentos.findAll({
                include: [
                    {
                        model: Projetos,
                        as: 'projeto'
                    },
                    {
                        model: Faturas,
                        as: 'fatura',
                        required: false
                    }
                ]
            });

            res.json({
                success: true,
                data: documentos
            });

        } catch (error) {
            console.error('Erro ao listar documentos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Listar documentos por projeto
    listarPorProjeto: async (req, res) => {
        try {
            const { idProjeto } = req.params;

            const documentos = await Documentos.findAll({
                where: { idProjeto },
                include: [
                    {
                        model: Projetos,
                        as: 'projeto'
                    },
                    {
                        model: Faturas,
                        as: 'fatura',
                        required: false
                    }
                ]
            });

            res.json({
                success: true,
                data: documentos
            });

        } catch (error) {
            console.error('Erro ao listar documentos por projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter documento por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const documento = await Documentos.findByPk(id, {
                include: [
                    {
                        model: Projetos,
                        as: 'projeto'
                    },
                    {
                        model: Faturas,
                        as: 'fatura',
                        required: false
                    }
                ]
            });

            if (!documento) {
                return res.status(404).json({
                    success: false,
                    message: 'Documento não encontrado'
                });
            }

            res.json({
                success: true,
                data: documento
            });

        } catch (error) {
            console.error('Erro ao obter documento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar novo documento
    criar: async (req, res) => {
        try {
            const { 
                nome_ficheiro, 
                caminho_ficheiro, 
                tipo_ficheiro, 
                tipo_documento, 
                descricao_documento, 
                idProjeto, 
                idFatura 
            } = req.body;

            // Validação básica
            if (!nome_ficheiro || !tipo_documento || !idProjeto) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome do ficheiro, tipo de documento e projeto são obrigatórios'
                });
            }

            const novoDocumento = await Documentos.create({
                nome_ficheiro,
                caminho_ficheiro,
                tipo_ficheiro,
                tipo_documento,
                descricao_documento,
                idProjeto,
                idFatura
            });

            res.status(201).json({
                success: true,
                message: 'Documento criado com sucesso',
                data: novoDocumento
            });

        } catch (error) {
            console.error('Erro ao criar documento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar documento
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                nome_ficheiro, 
                caminho_ficheiro, 
                tipo_ficheiro, 
                tipo_documento, 
                descricao_documento, 
                idFatura 
            } = req.body;

            const documento = await Documentos.findByPk(id);

            if (!documento) {
                return res.status(404).json({
                    success: false,
                    message: 'Documento não encontrado'
                });
            }

            await documento.update({
                nome_ficheiro,
                caminho_ficheiro,
                tipo_ficheiro,
                tipo_documento,
                descricao_documento,
                idFatura
            });

            res.json({
                success: true,
                message: 'Documento atualizado com sucesso',
                data: documento
            });

        } catch (error) {
            console.error('Erro ao atualizar documento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Excluir documento
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const documento = await Documentos.findByPk(id);

            if (!documento) {
                return res.status(404).json({
                    success: false,
                    message: 'Documento não encontrado'
                });
            }

            await documento.destroy();

            res.json({
                success: true,
                message: 'Documento excluído com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir documento:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = documentosController;
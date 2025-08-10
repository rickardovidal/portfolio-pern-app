const Clientes = require("../models/Clientes");
const Tipos_Clientes = require("../models/Tipos_Clientes");

const clientesController = {
    
    // Listar todos os clientes ativos
    listar: async (req, res) => {
        try {
            const clientes = await Clientes.findAll({
                include: [{
                    model: Tipos_Clientes,
                    as: "tipo"
                }]
            });

            res.json({
                success: true,
                data: clientes
            });

        } catch (error) {
            console.error("Erro ao listar clientes:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    },

    // Obter cliente por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const cliente = await Clientes.findOne({
                where: { 
                    idCliente: id,
                    ativo: true 
                },
                include: [{
                    model: Tipos_Clientes,
                    as: "tipo"
                }]
            });

            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: "Cliente não encontrado"
                });
            }

            res.json({
                success: true,
                data: cliente
            });

        } catch (error) {
            console.error("Erro ao obter cliente:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    },

    // Criar novo cliente
    criar: async (req, res) => {
        try {
            const { nome, email, telefone, empresa, nif, morada, notas, idTipo_Cliente } = req.body;

            // Validação básica
            if (!nome || !morada || !idTipo_Cliente) {
                return res.status(400).json({
                    success: false,
                    message: "Nome, morada e tipo de cliente são obrigatórios"
                });
            }

            const novoCliente = await Clientes.create({
                nome,
                email,
                telefone,
                empresa,
                nif,
                morada,
                notas,
                idTipo_Cliente,
                ativo: true
            });

            res.status(201).json({
                success: true,
                message: "Cliente criado com sucesso",
                data: novoCliente
            });

        } catch (error) {
            console.error("Erro ao criar cliente:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    },

    // Atualizar cliente
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { nome, email, telefone, empresa, nif, morada, notas, idTipo_Cliente } = req.body;

            const cliente = await Clientes.findOne({
                where: { 
                    idCliente: id,
                    ativo: true 
                }
            });

            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: "Cliente não encontrado"
                });
            }

            await cliente.update({
                nome,
                email,
                telefone,
                empresa,
                nif,
                morada,
                notas,
                idTipo_Cliente
            });

            res.json({
                success: true,
                message: "Cliente atualizado com sucesso",
                data: cliente
            });

        } catch (error) {
            console.error("Erro ao atualizar cliente:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    },

    // Soft delete - desativar cliente
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const cliente = await Clientes.findOne({
                where: { 
                    idCliente: id,
                    ativo: true 
                }
            });

            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: "Cliente não encontrado"
                });
            }

            await cliente.update({ ativo: false });

            res.json({
                success: true,
                message: "Cliente excluído com sucesso"
            });

        } catch (error) {
            console.error("Erro ao excluir cliente:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno do servidor"
            });
        }
    }
};

module.exports = clientesController;

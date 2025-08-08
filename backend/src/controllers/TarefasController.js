const Tarefas = require('../models/Tarefas');
const Projetos = require('../models/Projetos');

const tarefasController = {
    
    // Listar todas as tarefas
    listar: async (req, res) => {
        try {
            const tarefas = await Tarefas.findAll({
                include: [{
                    model: Projetos,
                    as: 'projeto'
                }]
            });

            res.json({
                success: true,
                data: tarefas
            });

        } catch (error) {
            console.error('Erro ao listar tarefas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Listar tarefas por projeto
    listarPorProjeto: async (req, res) => {
        try {
            const { idProjeto } = req.params;

            const tarefas = await Tarefas.findAll({
                where: { idProjeto },
                include: [{
                    model: Projetos,
                    as: 'projeto'
                }]
            });

            res.json({
                success: true,
                data: tarefas
            });

        } catch (error) {
            console.error('Erro ao listar tarefas por projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Obter tarefa por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const tarefa = await Tarefas.findByPk(id, {
                include: [{
                    model: Projetos,
                    as: 'projeto'
                }]
            });

            if (!tarefa) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarefa não encontrada'
                });
            }

            res.json({
                success: true,
                data: tarefa
            });

        } catch (error) {
            console.error('Erro ao obter tarefa:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Criar nova tarefa
    criar: async (req, res) => {
        try {
            const { 
                titulo_tarefa, 
                descricao, 
                estado_tarefa,
                dataTermino_prevista, 
                idProjeto 
            } = req.body;

            // Validação básica
            if (!titulo_tarefa || estado_tarefa === undefined || !idProjeto) {
                return res.status(400).json({
                    success: false,
                    message: 'Título, estado da tarefa e projeto são obrigatórios'
                });
            }

            const novaTarefa = await Tarefas.create({
                titulo_tarefa,
                descricao,
                estado_tarefa,
                dataTermino_prevista,
                idProjeto
            });

            res.status(201).json({
                success: true,
                message: 'Tarefa criada com sucesso',
                data: novaTarefa
            });

        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Atualizar tarefa
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                titulo_tarefa, 
                descricao, 
                estado_tarefa,
                dataTermino_prevista,
                dataTermino
            } = req.body;

            const tarefa = await Tarefas.findByPk(id);

            if (!tarefa) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarefa não encontrada'
                });
            }

            await tarefa.update({
                titulo_tarefa,
                descricao,
                estado_tarefa,
                dataTermino_prevista,
                dataTermino
            });

            res.json({
                success: true,
                message: 'Tarefa atualizada com sucesso',
                data: tarefa
            });

        } catch (error) {
            console.error('Erro ao atualizar tarefa:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Marcar tarefa como concluída
    concluir: async (req, res) => {
        try {
            const { id } = req.params;

            const tarefa = await Tarefas.findByPk(id);

            if (!tarefa) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarefa não encontrada'
                });
            }

            await tarefa.update({
                estado_tarefa: true,
                dataTermino: new Date()
            });

            res.json({
                success: true,
                message: 'Tarefa marcada como concluída',
                data: tarefa
            });

        } catch (error) {
            console.error('Erro ao concluir tarefa:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Excluir tarefa
    excluir: async (req, res) => {
        try {
            const { id } = req.params;

            const tarefa = await Tarefas.findByPk(id);

            if (!tarefa) {
                return res.status(404).json({
                    success: false,
                    message: 'Tarefa não encontrada'
                });
            }

            await tarefa.destroy();

            res.json({
                success: true,
                message: 'Tarefa excluída com sucesso'
            });

        } catch (error) {
            console.error('Erro ao excluir tarefa:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = tarefasController;
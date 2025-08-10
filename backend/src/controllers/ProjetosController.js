const Projetos = require('../models/Projetos');
const Clientes = require('../models/Clientes');
const Estados_Projeto = require('../models/Estados_Projeto');

const projetosController = {

    // ✅ CORRIGIDO: Listar todos os projetos com includes melhorados
    listar: async (req, res) => {
        try {
            console.log('🔍 Iniciando listagem de projetos...');
            
            const projetos = await Projetos.findAll({
                include: [
                    {
                        model: Clientes,
                        as: 'cliente',
                        where: { ativo: true }, // ✅ CRÍTICO: Apenas clientes ativos
                        required: false, // ✅ LEFT JOIN para não excluir projetos sem cliente
                        attributes: ['idCliente', 'nome', 'email', 'empresa'] // ✅ Otimização
                    },
                    {
                        model: Estados_Projeto,
                        as: 'estado',
                        attributes: ['idEstado_Projeto', 'designacaoEstado_Projeto'] // ✅ Otimização
                    }
                ],
                order: [
                    ['ativo', 'DESC'],
                    ['createdAt', 'DESC']
                ]
            });

            console.log(`📊 Projetos encontrados: ${projetos.length}`);
            
            // ✅ DEBUG: Verificar se os clientes estão a ser incluídos
            projetos.forEach((projeto, index) => {
                console.log(`Projeto ${index + 1}: ${projeto.nomeProjeto} - Cliente: ${projeto.cliente?.nome || 'CLIENTE NÃO ENCONTRADO'}`);
            });

            res.json({
                success: true,
                data: projetos
            });

        } catch (error) {
            console.error('❌ Erro ao listar projetos:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                debug: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Obter projeto por ID
    obterPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const projeto = await Projetos.findOne({
                where: {
                    idProjeto: id,
                    ativo: true
                },
                include: [
                    {
                        model: Clientes,
                        as: 'cliente',
                        where: { ativo: true },
                        required: false
                    },
                    {
                        model: Estados_Projeto,
                        as: 'estado'
                    }
                ]
            });

            if (!projeto) {
                return res.status(404).json({
                    success: false,
                    message: 'Projeto não encontrado'
                });
            }

            res.json({
                success: true,
                data: projeto
            });

        } catch (error) {
            console.error('Erro ao obter projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // ✅ CORRIGIDO: Criar novo projeto
    criar: async (req, res) => {
        try {
            const { 
                nomeProjeto, 
                descricaoProjeto, 
                dataInicio, 
                dataPrevista_Fim, 
                dataFim,
                orcamentoTotal, 
                notas, 
                idCliente, 
                idEstado_Projeto,
                servicos = [] // ✅ Default para array vazio
            } = req.body;

            console.log('📝 Criando novo projeto:', { nomeProjeto, idCliente, idEstado_Projeto });

            // Validação básica
            if (!nomeProjeto || !idCliente || !idEstado_Projeto) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome do projeto, cliente e estado são obrigatórios'
                });
            }

            // ✅ ADICIONADO: Verificar se o cliente existe e está ativo
            const clienteExiste = await Clientes.findOne({
                where: { idCliente, ativo: true }
            });

            if (!clienteExiste) {
                return res.status(400).json({
                    success: false,
                    message: 'Cliente não encontrado ou inativo'
                });
            }

            const novoProjeto = await Projetos.create({
                nomeProjeto,
                descricaoProjeto,
                dataInicio,
                dataPrevista_Fim,
                dataFim,
                orcamentoTotal: orcamentoTotal || 0,
                notas,
                idCliente,
                idEstado_Projeto,
                ativo: true
            });

            console.log('✅ Projeto criado com ID:', novoProjeto.idProjeto);

            // Associar serviços se fornecidos
            if (servicos.length > 0) {
                const Projetos_Servicos = require('../models/Projetos_servicos');
                const Servicos = require('../models/Servicos');

                for (const servicoId of servicos) {
                    try {
                        const servico = await Servicos.findByPk(servicoId);
                        if (servico) {
                            await Projetos_Servicos.create({
                                idProjeto: novoProjeto.idProjeto,
                                idServico: servicoId,
                                quantidade: 1,
                                preco_unitario: servico.preco_base_servico || 0,
                                preco_total: servico.preco_base_servico || 0
                            });
                        }
                    } catch (error) {
                        console.error(`Erro ao associar serviço ${servicoId}:`, error);
                    }
                }
                console.log(`✅ ${servicos.length} serviços associados`);
            }

            res.status(201).json({
                success: true,
                message: 'Projeto criado com sucesso',
                data: novoProjeto
            });

        } catch (error) {
            console.error('❌ Erro ao criar projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                debug: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Atualizar projeto
    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const { 
                nomeProjeto, 
                descricaoProjeto, 
                dataInicio, 
                dataPrevista_Fim, 
                dataFim,
                orcamentoTotal, 
                notas, 
                idCliente, 
                idEstado_Projeto,
                ativo,
                servicos
            } = req.body;

            const projeto = await Projetos.findOne({
                where: { 
                    idProjeto: id,
                    ativo: true 
                }
            });

            if (!projeto) {
                return res.status(404).json({
                    success: false,
                    message: 'Projeto não encontrado'
                });
            }

            // ✅ ADICIONADO: Se há mudança de cliente, verificar se o novo cliente existe
            if (idCliente && idCliente !== projeto.idCliente) {
                const clienteExiste = await Clientes.findOne({
                    where: { idCliente, ativo: true }
                });

                if (!clienteExiste) {
                    return res.status(400).json({
                        success: false,
                        message: 'Cliente não encontrado ou inativo'
                    });
                }
            }

            await projeto.update({
                nomeProjeto: nomeProjeto || projeto.nomeProjeto,
                descricaoProjeto: descricaoProjeto || projeto.descricaoProjeto,
                dataInicio: dataInicio || projeto.dataInicio,
                dataPrevista_Fim: dataPrevista_Fim || projeto.dataPrevista_Fim,
                dataFim: dataFim || projeto.dataFim,
                orcamentoTotal: orcamentoTotal !== undefined ? orcamentoTotal : projeto.orcamentoTotal,
                notas: notas !== undefined ? notas : projeto.notas,
                idCliente: idCliente || projeto.idCliente,
                idEstado_Projeto: idEstado_Projeto || projeto.idEstado_Projeto,
                ativo: ativo !== undefined ? ativo : projeto.ativo
            });

            // Atualizar associações de serviços se fornecidas
            if (servicos !== undefined) {
                const Projetos_Servicos = require('../models/Projetos_servicos');
                const Servicos = require('../models/Servicos');

                // Remover associações existentes
                await Projetos_Servicos.destroy({
                    where: { idProjeto: id }
                });

                // Criar novas associações
                if (servicos.length > 0) {
                    for (const servicoId of servicos) {
                        try {
                            const servico = await Servicos.findByPk(servicoId);
                            if (servico) {
                                await Projetos_Servicos.create({
                                    idProjeto: parseInt(id),
                                    idServico: parseInt(servicoId),
                                    quantidade: 1,
                                    preco_unitario: parseFloat(servico.preco_base_servico || 0),
                                    preco_total: parseFloat(servico.preco_base_servico || 0)
                                });
                            }
                        } catch (error) {
                            console.error(`Erro ao criar associação com serviço ${servicoId}:`, error);
                        }
                    }
                }
            }

            res.json({
                success: true,
                message: 'Projeto atualizado com sucesso',
                data: projeto
            });

        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Desativar projeto (soft delete)
    desativar: async (req, res) => {
        try {
            const { id } = req.params;

            const projeto = await Projetos.findOne({
                where: { 
                    idProjeto: id,
                    ativo: true 
                }
            });

            if (!projeto) {
                return res.status(404).json({
                    success: false,
                    message: 'Projeto não encontrado'
                });
            }

            await projeto.update({ ativo: false });

            res.json({
                success: true,
                message: 'Projeto desativado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao desativar projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = projetosController;
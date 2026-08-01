const Projetos = require('../models/Projetos');
const Clientes = require('../models/Clientes');
const Estados_Projeto = require('../models/Estados_Projeto');
const Servicos = require('../models/Servicos');

const IVA_TAXA = 0.23;

// Soma o preço atual dos serviços indicados + trabalho extra, com IVA
const calcularOrcamentoAuto = async (servicosIds, horasExtra, custoHora) => {
    let subtotalServicos = 0;
    if (servicosIds && servicosIds.length > 0) {
        for (const servicoId of servicosIds) {
            const servico = await Servicos.findByPk(servicoId);
            if (servico) {
                subtotalServicos += parseFloat(servico.preco_base_servico || 0);
            }
        }
    }
    const trabalhoExtra = (parseFloat(horasExtra) || 0) * (parseFloat(custoHora) || 0);
    const subtotal = subtotalServicos + trabalhoExtra;
    return subtotal + subtotal * IVA_TAXA;
};

// Projetos não fixados manualmente seguem sempre o preço atual do catálogo
const aplicarOrcamentoAoVivo = (projeto) => {
    const projetoJson = projeto.toJSON ? projeto.toJSON() : projeto;
    if (!projetoJson.orcamentoManual && projetoJson.servicos) {
        const subtotalServicos = projetoJson.servicos.reduce(
            (soma, servico) => soma + parseFloat(servico.preco_base_servico || 0), 0
        );
        const trabalhoExtra = (parseFloat(projetoJson.horasExtra) || 0) * (parseFloat(projetoJson.custoHora) || 0);
        const subtotal = subtotalServicos + trabalhoExtra;
        projetoJson.orcamentoTotal = subtotal + subtotal * IVA_TAXA;
    }
    return projetoJson;
};

const projetosController = {

    listar: async (req, res) => {
        try {
            console.log('🔍 [DEBUG] Iniciando listagem de projetos...');

            const projetos = await Projetos.findAll({
                include: [
                    {
                        model: Clientes,
                        as: 'cliente'
                    },
                    {
                        model: Estados_Projeto,
                        as: 'estado'
                    },
                    {
                        model: Servicos,
                        as: 'servicos',
                        through: { attributes: [] }
                    }
                ],
                order: [
                    ['ativo', 'DESC'],
                    ['createdAt', 'DESC']
                ]
            });

            console.log(`📊 [DEBUG] Projetos encontrados: ${projetos.length}`);
            
            // 🔍 DEBUG: Verificar cada projeto
            projetos.forEach((projeto, index) => {
                console.log(`[DEBUG] Projeto ${index + 1}:`);
                console.log(`  - Nome: ${projeto.nomeProjeto}`);
                console.log(`  - idCliente: ${projeto.idCliente}`);
                console.log(`  - cliente object: ${projeto.cliente ? 'EXISTS' : 'NULL'}`);
                if (projeto.cliente) {
                    console.log(`  - cliente.nome: ${projeto.cliente.nome}`);
                } else {
                    console.log(`  - ❌ CLIENTE NULL - Isto é o problema!`);
                }
            });

            // 🔍 DEBUG: Mostrar JSON da resposta
            console.log('[DEBUG] JSON que será enviado ao frontend:');
            console.log(JSON.stringify({
                success: true,
                data: projetos.slice(0, 1) // Só o primeiro para não encher os logs
            }, null, 2));

            res.json({
                success: true,
                data: projetos.map(aplicarOrcamentoAoVivo)
            });

        } catch (error) {
            console.error('❌ [DEBUG] Erro ao listar projetos:', error);
            console.error('❌ [DEBUG] Stack:', error.stack);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
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
                        as: 'cliente'
                    },
                    {
                        model: Estados_Projeto,
                        as: 'estado'
                    },
                    {
                        model: Servicos,
                        as: 'servicos',
                        through: { attributes: [] }
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
                data: aplicarOrcamentoAoVivo(projeto)
            });

        } catch (error) {
            console.error('Erro ao obter projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    // Função criar com estado padrão "Pendente"
    criar: async (req, res) => {
        try {
            const {
                nomeProjeto,
                descricaoProjeto,
                dataInicio,
                dataPrevista_Fim,
                dataFim,
                notas,
                idCliente,
                horasEstimadas,
                custoHora,
                horasExtra,
                orcamentoManual,
                servicos = [] // Array de serviços selecionados
            } = req.body;

            // Horas e custo/hora são opcionais; valores inválidos ficam null
            const horasValidas = Number.isInteger(parseInt(horasEstimadas, 10)) && parseInt(horasEstimadas, 10) >= 0
                ? parseInt(horasEstimadas, 10) : null;
            const custoHoraValido = !isNaN(parseFloat(custoHora)) && parseFloat(custoHora) >= 0
                ? parseFloat(custoHora) : null;
            const horasExtraValida = Number.isInteger(parseInt(horasExtra, 10)) && parseInt(horasExtra, 10) >= 0
                ? parseInt(horasExtra, 10) : null;

            // Validação obrigatória
            if (!nomeProjeto || !idCliente) {
                return res.status(400).json({
                    success: false,
                    message: 'Nome do projeto e cliente são obrigatórios'
                });
            }

            // Verificar se cliente existe
            const cliente = await Clientes.findByPk(idCliente);
            if (!cliente) {
                return res.status(404).json({
                    success: false,
                    message: 'Cliente não encontrado'
                });
            }

            // Buscar estado "Pendente" como padrão
            const estadoPendente = await Estados_Projeto.findOne({
                where: { designacaoEstado_Projeto: 'Pendente' }
            });

            if (!estadoPendente) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado "Pendente" não encontrado na base de dados'
                });
            }

            // Orçamento: se não for fixado manualmente, calcula sempre a partir do preço atual dos serviços
            const isOrcamentoManual = orcamentoManual === true;
            let orcamentoTotal;
            if (isOrcamentoManual) {
                const valorManual = parseFloat(req.body.orcamentoTotal);
                orcamentoTotal = (!isNaN(valorManual) && valorManual >= 0)
                    ? valorManual
                    : await calcularOrcamentoAuto(servicos, horasExtraValida, custoHoraValido);
            } else {
                orcamentoTotal = await calcularOrcamentoAuto(servicos, horasExtraValida, custoHoraValido);
            }

            // Criar projeto com estado padrão "Pendente"
            const novoProjeto = await Projetos.create({
                nomeProjeto,
                descricaoProjeto,
                dataInicio: dataInicio || null,
                dataPrevista_Fim: dataPrevista_Fim || null,
                dataFim: dataFim || null,
                orcamentoTotal: orcamentoTotal,
                horasEstimadas: horasValidas,
                custoHora: custoHoraValido,
                horasExtra: horasExtraValida,
                orcamentoManual: isOrcamentoManual,
                notas,
                idCliente,
                idEstado_Projeto: estadoPendente.idEstado_Projeto,
                ativo: true
            });

            // Associar serviços ao projeto se foram fornecidos
            if (servicos && servicos.length > 0) {
                const Projetos_Servicos = require('../models/Projetos_servicos');

                for (const servicoId of servicos) {
                    const servico = await require('../models/Servicos').findByPk(servicoId);
                    if (servico) {
                        await Projetos_Servicos.create({
                            idProjeto: novoProjeto.idProjeto,
                            idServico: servicoId,
                            quantidade: 1,
                            preco_unitario: servico.preco_base_servico,
                            preco_total: servico.preco_base_servico
                        });
                    }
                }
            }

            // Retornar projeto criado com associações
            const projetoCriado = await Projetos.findByPk(novoProjeto.idProjeto, {
                include: [
                    {
                        model: Clientes,
                        as: 'cliente'
                    },
                    {
                        model: Estados_Projeto,
                        as: 'estado'
                    }
                ]
            });

            res.status(201).json({
                success: true,
                message: 'Projeto criado com sucesso',
                data: projetoCriado
            });

        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    },

    atualizar: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                nomeProjeto,
                descricaoProjeto,
                dataInicio,
                dataPrevista_Fim,
                dataFim,
                notas,
                idCliente,
                idEstado_Projeto,
                ativo,
                horasEstimadas,
                custoHora,
                horasExtra,
                orcamentoManual,
                servicos // Array de serviços selecionados (pode ser undefined, array vazio, ou com IDs)
            } = req.body;

            console.log('Atualizando projeto:', id);
            console.log('Serviços recebidos:', servicos);

            const projeto = await Projetos.findByPk(id);
            if (!projeto) {
                return res.status(404).json({
                    success: false,
                    message: 'Projeto não encontrado'
                });
            }

            // Horas extra: se não vier no pedido, mantém o valor guardado
            const horasExtraValida = horasExtra !== undefined
                ? (Number.isInteger(parseInt(horasExtra, 10)) && parseInt(horasExtra, 10) >= 0 ? parseInt(horasExtra, 10) : null)
                : projeto.horasExtra;
            const custoHoraValido = custoHora !== undefined
                ? (!isNaN(parseFloat(custoHora)) && parseFloat(custoHora) >= 0 ? parseFloat(custoHora) : null)
                : projeto.custoHora;

            // Orçamento: se não for fixado manualmente, segue sempre o preço atual dos serviços selecionados
            const isOrcamentoManual = orcamentoManual !== undefined ? orcamentoManual === true : projeto.orcamentoManual;
            let orcamentoTotal;
            if (isOrcamentoManual) {
                const valorManual = parseFloat(req.body.orcamentoTotal);
                orcamentoTotal = (!isNaN(valorManual) && valorManual >= 0) ? valorManual : projeto.orcamentoTotal;
            } else {
                const servicosParaCalculo = servicos !== undefined
                    ? servicos
                    : (await projeto.getServicos()).map(s => s.idServico);
                orcamentoTotal = await calcularOrcamentoAuto(servicosParaCalculo, horasExtraValida, custoHoraValido);
            }

            // Atualizar dados do projeto
            await projeto.update({
                nomeProjeto: nomeProjeto || projeto.nomeProjeto,
                descricaoProjeto: descricaoProjeto || projeto.descricaoProjeto,
                dataInicio: dataInicio || projeto.dataInicio,
                dataPrevista_Fim: dataPrevista_Fim || projeto.dataPrevista_Fim,
                dataFim: dataFim || projeto.dataFim,
                orcamentoTotal: orcamentoTotal,
                horasEstimadas: horasEstimadas !== undefined
                    ? (Number.isInteger(parseInt(horasEstimadas, 10)) && parseInt(horasEstimadas, 10) >= 0 ? parseInt(horasEstimadas, 10) : null)
                    : projeto.horasEstimadas,
                custoHora: custoHoraValido,
                horasExtra: horasExtraValida,
                orcamentoManual: isOrcamentoManual,
                notas: notas !== undefined ? notas : projeto.notas,
                idCliente: idCliente || projeto.idCliente,
                idEstado_Projeto: idEstado_Projeto || projeto.idEstado_Projeto,
                ativo: ativo !== undefined ? ativo : projeto.ativo
            });

            // ✅ CORREÇÃO: Atualizar associações de serviços apenas se foram fornecidas
            if (servicos !== undefined) {
                const Projetos_Servicos = require('../models/Projetos_servicos');
                const Servicos = require('../models/Servicos');

                console.log('Atualizando associações de serviços...');

                try {
                    // Remover associações existentes
                    const deleted = await Projetos_Servicos.destroy({
                        where: { idProjeto: id }
                    });
                    console.log(`${deleted} associações removidas`);

                    // Criar novas associações (apenas se há serviços selecionados)
                    if (servicos.length > 0) {
                        for (const servicoId of servicos) {
                            try {
                                const servico = await Servicos.findByPk(servicoId);
                                if (servico) {
                                    const novaAssociacao = await Projetos_Servicos.create({
                                        idProjeto: parseInt(id),
                                        idServico: parseInt(servicoId),
                                        quantidade: 1,
                                        preco_unitario: parseFloat(servico.preco_base_servico || 0),
                                        preco_total: parseFloat(servico.preco_base_servico || 0)
                                    });
                                    console.log('Nova associação criada:', novaAssociacao.idProjeto_Servico);
                                } else {
                                    console.warn(`Serviço ${servicoId} não encontrado`);
                                }
                            } catch (associacaoError) {
                                console.error(`Erro ao criar associação com serviço ${servicoId}:`, associacaoError);
                                // Continua para os próximos serviços mesmo se um falhar
                            }
                        }
                        console.log(`${servicos.length} novas associações processadas`);
                    } else {
                        console.log('Nenhum serviço selecionado - todas as associações foram removidas');
                    }
                } catch (associacaoError) {
                    console.error('Erro ao gerir associações de serviços:', associacaoError);
                    // Não retornar erro aqui, pois o projeto já foi atualizado
                    // Apenas log do erro para debug
                }
            } else {
                console.log('Serviços não foram fornecidos - mantendo associações existentes');
            }

            // Buscar projeto atualizado com includes
            const projetoAtualizado = await Projetos.findByPk(id, {
                include: [
                    {
                        model: require('../models/Clientes'),
                        as: 'cliente'
                    },
                    {
                        model: require('../models/Estados_Projeto'),
                        as: 'estado'
                    }
                ]
            });

            console.log('Projeto atualizado com sucesso');

            res.json({
                success: true,
                message: 'Projeto atualizado com sucesso',
                data: projetoAtualizado
            });

        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            console.error('Stack trace:', error.stack);

            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Soft delete - cancelar projeto (muda estado para "Desativado")
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

            // Buscar o estado "Cancelado" (assumindo que existe na BD)
            const estadoCancelado = await Estados_Projeto.findOne({
                where: { designacaoEstado_Projeto: 'Desativado' }
            });

            if (!estadoCancelado) {
                return res.status(400).json({
                    success: false,
                    message: 'Estado "Desativado" não encontrado na base de dados'
                });
            }

            await projeto.update({
                idEstado_Projeto: estadoCancelado.idEstado_Projeto,
                ativo: false
            });

            res.json({
                success: true,
                message: 'Projeto Desativado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao Desativar projeto:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor'
            });
        }
    }
};

module.exports = projetosController;
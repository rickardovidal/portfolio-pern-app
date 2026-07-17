const Clientes = require('../models/Clientes');
const Projetos = require('../models/Projetos');
const Servicos = require('../models/Servicos');
const Projetos_Servicos = require('../models/Projetos_servicos');
const Tipos_Clientes = require('../models/Tipos_Clientes');
const Estados_Projeto = require('../models/Estados_Projeto');
const Tipos_Servicos = require('../models/tipos_servicos');

const getCorPorEstado = (nomeEstado) => {
    switch ((nomeEstado || '').toLowerCase()) {
        case 'concluído': return '#28a745';
        case 'em andamento': return '#007bff';
        case 'pendente': return '#ffc107';
        case 'iniciado': return '#17a2b8';
        case 'desativado': return '#dc3545';
        default: return '#6c757d';
    }
};

const getCorTipoServico = (tipoNome) => {
    const nome = (tipoNome || '').toLowerCase();
    if (nome.includes('design')) return '#dc3545';
    if (nome.includes('desenvolvimento')) return '#007bff';
    if (nome.includes('multimédia')) return '#ffc107';
    if (nome.includes('consultoria')) return '#17a2b8';
    return '#28a745';
};

const calcularReceitaPorMes = (projetosAtivos) => {
    const meses = [];
    const agora = new Date();

    for (let i = 11; i >= 0; i--) {
        const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
        const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;

        const projetosDoMes = projetosAtivos.filter(p => {
            const referencia = p.dataInicio || p.createdAt;
            if (!referencia) return false;
            const dataReferencia = new Date(referencia);
            return dataReferencia.getMonth() === data.getMonth() &&
                dataReferencia.getFullYear() === data.getFullYear();
        });

        const receitaMes = projetosDoMes.reduce((total, p) => total + parseFloat(p.orcamentoTotal || 0), 0);

        meses.push({ mes: mesAno, receita: receitaMes, projetos: projetosDoMes.length });
    }

    return meses;
};

const calcularCrescimento = (dados) => {
    if (dados.length < 2) return 0;

    const hoje = new Date();
    const umMesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());

    const recentes = dados.filter(item => new Date(item.createdAt) >= umMesAtras).length;
    const antigos = dados.length - recentes;

    return antigos > 0 ? parseFloat(((recentes / antigos) * 100).toFixed(1)) : 0;
};

const estatisticasController = {
    obter: async (req, res) => {
        try {
            const [clientes, projetos, servicos, projetosServicos, tiposCliente, estadosProjeto, tiposServico] = await Promise.all([
                Clientes.findAll(),
                Projetos.findAll(),
                Servicos.findAll(),
                Projetos_Servicos.findAll(),
                Tipos_Clientes.findAll(),
                Estados_Projeto.findAll(),
                Tipos_Servicos.findAll()
            ]);

            const projetosAtivos = projetos.filter(p => p.ativo === true);
            const receitaTotal = projetosAtivos.reduce((total, p) => total + parseFloat(p.orcamentoTotal || 0), 0);

            const idsProjetosAtivos = new Set(projetosAtivos.map(p => p.idProjeto));
            const custoTotal = projetosServicos
                .filter(ps => idsProjetosAtivos.has(ps.idProjeto))
                .reduce((total, ps) => {
                    const servico = servicos.find(s => s.idServico === ps.idServico);
                    const custoUnitario = parseFloat(servico?.custo_servico || 0);
                    return total + custoUnitario * parseInt(ps.quantidade || 1, 10);
                }, 0);
            const lucroTotal = receitaTotal - custoTotal;

            const servicosCount = {};
            projetosServicos.forEach(ps => {
                const servico = servicos.find(s => s.idServico === ps.idServico);
                if (servico) {
                    if (!servicosCount[servico.idServico]) {
                        servicosCount[servico.idServico] = {
                            nome: servico.designacao_servico,
                            count: 0,
                            receita: 0
                        };
                    }
                    servicosCount[servico.idServico].count += parseInt(ps.quantidade || 1, 10);
                    servicosCount[servico.idServico].receita += parseFloat(ps.preco_total || 0);
                }
            });
            const servicosPopulares = Object.values(servicosCount)
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            const projetosPorEstado = estadosProjeto.map(estado => {
                const count = projetos.filter(p => p.idEstado_Projeto === estado.idEstado_Projeto).length;
                return {
                    nome: estado.designacaoEstado_Projeto,
                    count,
                    percentagem: projetos.length > 0 ? parseFloat(((count / projetos.length) * 100).toFixed(1)) : 0,
                    cor: getCorPorEstado(estado.designacaoEstado_Projeto)
                };
            }).filter(item => item.count > 0);

            const clientesPorTipo = tiposCliente.map(tipo => {
                const count = clientes.filter(c => c.idTipo_Cliente === tipo.idTipo_Cliente).length;
                return {
                    nome: tipo.designacaoTipo_cliente,
                    count,
                    percentagem: clientes.length > 0 ? parseFloat(((count / clientes.length) * 100).toFixed(1)) : 0,
                    cor: tipo.idTipo_Cliente === 1 ? '#28a745' : '#007bff'
                };
            }).filter(item => item.count > 0);

            const servicosPorTipo = tiposServico.map(tipo => {
                const count = servicos.filter(s => s.idTipo_Servico === tipo.idTipo_Servico).length;
                return {
                    nome: tipo.designacao,
                    count,
                    percentagem: servicos.length > 0 ? parseFloat(((count / servicos.length) * 100).toFixed(1)) : 0,
                    cor: getCorTipoServico(tipo.designacao)
                };
            }).filter(item => item.count > 0).sort((a, b) => b.count - a.count);

            const receitaPorMes = calcularReceitaPorMes(projetosAtivos);

            const tendencias = {
                crescimentoClientes: calcularCrescimento(clientes),
                crescimentoProjetos: calcularCrescimento(projetos),
                eficienciaServicos: servicos.length > 0
                    ? parseFloat((servicos.filter(s => s.ativo).length / servicos.length * 100).toFixed(1))
                    : 0
            };

            res.json({
                success: true,
                data: {
                    geral: {
                        totalClientes: clientes.length,
                        totalProjetos: projetos.length,
                        projetosAtivos: projetosAtivos.length,
                        receitaTotal,
                        custoTotal,
                        lucroTotal,
                        totalServicos: servicos.length
                    },
                    servicosPopulares,
                    projetosPorEstado,
                    clientesPorTipo,
                    servicosPorTipo,
                    receitaPorMes,
                    tendencias
                }
            });
        } catch (error) {
            console.error('Erro ao calcular estatísticas:', error);
            res.status(500).json({
                success: false,
                message: 'Erro ao calcular estatísticas'
            });
        }
    }
};

module.exports = estatisticasController;

import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import NotificationService from '../services/NotificationService';

const EstatisticasManager = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('geral');
    const [stats, setStats] = useState({
        geral: {
            totalClientes: 0,
            totalProjetos: 0,
            projetosAtivos: 0,
            receitaTotal: 0,
            custoTotal: 0,
            lucroTotal: 0,
            totalServicos: 0
        },
        servicosPopulares: [],
        projetosPorEstado: [],
        clientesPorTipo: [],
        receitaPorMes: [],
        servicosPorTipo: []
    });

    useEffect(() => {
        loadEstatisticas();
    }, []);

    const loadEstatisticas = async () => {
        try {
            setLoading(true);

            // Carregar dados básicos
            const [clientesRes, projetosRes, servicosRes, tiposClienteRes, estadosProjetoRes, projetosServicosRes] = await Promise.all([
                api.get('/clientes'),
                api.get('/projetos'),
                api.get('/servicos'),
                api.get('/tipos-clientes'),
                api.get('/estados-projeto'),
                api.get('/projetos-servicos')
            ]);

            const clientes = clientesRes.data.data || [];
            const projetos = projetosRes.data.data || [];
            const servicos = servicosRes.data.data || [];
            const tiposCliente = tiposClienteRes.data.data || [];
            const estadosProjeto = estadosProjetoRes.data.data || [];
            const projetosServicos = projetosServicosRes.data.data || [];

            // Calcular estatísticas gerais
            const projetosAtivos = projetos.filter(p => p.ativo === true);
            const receitaTotal = projetos.reduce((total, p) => total + parseFloat(p.orcamentoTotal || 0), 0);
            const custoTotal = servicos.reduce((total, s) => total + parseFloat(s.custo_servico || 0), 0);
            const lucroTotal = receitaTotal - custoTotal;

            // Serviços mais populares
            const servicosCount = {};
            projetosServicos.forEach(ps => {
                const servico = servicos.find(s => s.idServico == ps.idServico);
                if (servico) {
                    if (!servicosCount[servico.idServico]) {
                        servicosCount[servico.idServico] = {
                            nome: servico.designacao_servico,
                            count: 0,
                            receita: 0
                        };
                    }
                    servicosCount[servico.idServico].count += parseInt(ps.quantidade || 1);
                    servicosCount[servico.idServico].receita += parseFloat(ps.preco_total || 0);
                }
            });

            const servicosPopulares = Object.values(servicosCount)
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            // Projetos por estado
            const projetosPorEstado = estadosProjeto.map(estado => ({
                nome: estado.designacaoEstado_Projeto,
                count: projetos.filter(p => p.idEstado_Projeto == estado.idEstado_Projeto).length,
                cor: getCorPorEstado(estado.designacaoEstado_Projeto)
            })).filter(item => item.count > 0);

            // Clientes por tipo
            const clientesPorTipo = tiposCliente.map(tipo => ({
                nome: tipo.designacaoTipo_cliente,
                count: clientes.filter(c => c.idTipo_Cliente == tipo.idTipo_Cliente).length,
                cor: tipo.idTipo_Cliente == 1 ? '#28a745' : '#007bff'
            })).filter(item => item.count > 0);

            // Receita por mês (últimos 12 meses)
            const receitaPorMes = calcularReceitaPorMes(projetos);

            // Serviços por tipo
            const servicosPorTipo = await calcularServicosPorTipo(servicos);

            setStats({
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
                receitaPorMes,
                servicosPorTipo
            });

        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            NotificationService.error('Erro ao carregar estatísticas. Verifica a conexão com o servidor.');
        } finally {
            setLoading(false);
        }
    };

    const getCorPorEstado = (nomeEstado) => {
        switch (nomeEstado?.toLowerCase()) {
            case 'concluído': return '#28a745';
            case 'em andamento': return '#007bff';
            case 'pendente': return '#ffc107';
            case 'iniciado': return '#17a2b8';
            case 'desativado': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const calcularReceitaPorMes = (projetos) => {
        const meses = [];
        const agora = new Date();

        for (let i = 11; i >= 0; i--) {
            const data = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
            const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;

            const receitaMes = projetos
                .filter(p => {
                    if (!p.dataInicio) return false;
                    const dataInicio = new Date(p.dataInicio);
                    return dataInicio.getMonth() === data.getMonth() &&
                        dataInicio.getFullYear() === data.getFullYear();
                })
                .reduce((total, p) => total + parseFloat(p.orcamentoTotal || 0), 0);

            meses.push({
                mes: mesAno,
                receita: receitaMes
            });
        }

        return meses;
    };

    const calcularServicosPorTipo = async (servicos) => {
        try {
            const response = await api.get('/tipos-servicos');
            const tiposServico = response.data.data || [];

            return tiposServico.map(tipo => ({
                nome: tipo.designacao_TipoServico,
                count: servicos.filter(s => s.idTipo_Servico == tipo.idTipo_Servico).length,
                cor: `hsl(${tipo.idTipo_Servico * 60}, 70%, 50%)`
            })).filter(item => item.count > 0);
        } catch (error) {
            console.error('Erro ao calcular serviços por tipo:', error);
            return [];
        }
    };

    const renderGraficoBarra = (dados, titulo, valorKey = 'count', corKey = 'cor') => (
        <div className="card mb-4">
            <div className="card-header">
                <h6 className="mb-0">{titulo}</h6>
            </div>
            <div className="card-body">
                {dados.length === 0 ? (
                    <p className="text-muted text-center">Sem dados para exibir</p>
                ) : (
                    <div>
                        {dados.map((item, index) => {
                            const maxValue = Math.max(...dados.map(d => d[valorKey]));
                            const percentage = maxValue > 0 ? (item[valorKey] / maxValue) * 100 : 0;

                            return (
                                <div key={index} className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <small className="text-muted">{item.nome}</small>
                                        <small>
                                            <strong>
                                                {valorKey === 'receita' ? `€${item[valorKey].toFixed(2)}` : item[valorKey]}
                                            </strong>
                                        </small>
                                    </div>
                                    <div className="progress" style={{ height: '8px' }}>
                                        <div
                                            className="progress-bar"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: item[corKey] || '#007bff'
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );

    const renderGraficoLinha = (dados, titulo) => (
        <div className="card mb-4">
            <div className="card-header">
                <h6 className="mb-0">{titulo}</h6>
            </div>
            <div className="card-body">
                {dados.length === 0 ? (
                    <p className="text-muted text-center">Sem dados para exibir</p>
                ) : (
                    <div>
                        <div className="row mb-2">
                            {dados.slice(-6).map((item, index) => (
                                <div key={index} className="col text-center">
                                    <small className="text-muted d-block">{item.mes}</small>
                                    <strong className="text-primary">€{item.receita.toFixed(0)}</strong>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex align-items-end" style={{ height: '100px' }}>
                            {dados.slice(-6).map((item, index) => {
                                const maxValue = Math.max(...dados.map(d => d.receita));
                                const height = maxValue > 0 ? (item.receita / maxValue) * 80 : 0;

                                return (
                                    <div
                                        key={index}
                                        className="bg-primary mx-1 flex-fill"
                                        style={{
                                            height: `${height}px`,
                                            minHeight: '2px',
                                            opacity: 0.8
                                        }}
                                        title={`${item.mes}: €${item.receita.toFixed(2)}`}
                                    ></div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">A carregar estatísticas...</span>
                </div>
                <p className="mt-2 text-muted">A processar dados...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Estatísticas e Relatórios</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={loadEstatisticas}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Atualizar Dados
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'geral' ? 'active' : ''}`}
                        onClick={() => setActiveTab('geral')}
                    >
                        <i className="bi bi-graph-up me-2"></i>
                        Visão Geral
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'servicos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('servicos')}
                    >
                        <i className="bi bi-gear me-2"></i>
                        Serviços
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'projetos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('projetos')}
                    >
                        <i className="bi bi-folder me-2"></i>
                        Projetos
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'financeiro' ? 'active' : ''}`}
                        onClick={() => setActiveTab('financeiro')}
                    >
                        <i className="bi bi-currency-euro me-2"></i>
                        Financeiro
                    </button>
                </li>
            </ul>

            {/* Conteúdo das Tabs */}
            {activeTab === 'geral' && (
                <div>
                    {/* Cartões de Resumo */}
                    <div className="row mb-4">
                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-left-primary shadow h-100 py-2" style={{ borderLeft: '4px solid #007bff' }}>
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Total de Clientes
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                {stats.geral.totalClientes}
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="bi bi-people fa-2x text-primary"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-left-success shadow h-100 py-2" style={{ borderLeft: '4px solid #28a745' }}>
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                Projetos Ativos
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                {stats.geral.projetosAtivos} / {stats.geral.totalProjetos}
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="bi bi-folder-check fa-2x text-success"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-left-info shadow h-100 py-2" style={{ borderLeft: '4px solid #17a2b8' }}>
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                Total de Serviços
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                {stats.geral.totalServicos}
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="bi bi-gear fa-2x text-info"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-left-warning shadow h-100 py-2" style={{ borderLeft: '4px solid #ffc107' }}>
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                Receita Total
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                €{stats.geral.receitaTotal.toFixed(2)}
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <i className="bi bi-currency-euro fa-2x text-warning"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos de Visão Geral */}
                    <div className="row">
                        <div className="col-md-6">
                            {renderGraficoBarra(stats.clientesPorTipo, 'Clientes por Tipo')}
                        </div>
                        <div className="col-md-6">
                            {renderGraficoBarra(stats.projetosPorEstado, 'Projetos por Estado')}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'servicos' && (
                <div className="row">
                    <div className="col-md-6">
                        {renderGraficoBarra(stats.servicosPopulares, 'Serviços Mais Requisitados')}
                    </div>
                    <div className="col-md-6">
                        {renderGraficoBarra(stats.servicosPopulares, 'Receita por Serviço', 'receita')}
                    </div>
                    <div className="col-md-6">
                        {renderGraficoBarra(stats.servicosPorTipo, 'Serviços por Tipo')}
                    </div>
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="mb-0">Análise de Serviços</h6>
                            </div>
                            <div className="card-body">
                                <div className="row text-center">
                                    <div className="col-6 mb-3">
                                        <div className="border-end">
                                            <h4 className="text-primary">{stats.servicosPopulares.length}</h4>
                                            <small className="text-muted">Serviços Utilizados</small>
                                        </div>
                                    </div>
                                    <div className="col-6 mb-3">
                                        <h4 className="text-success">
                                            {stats.servicosPopulares.reduce((total, s) => total + s.count, 0)}
                                        </h4>
                                        <small className="text-muted">Total de Utilizações</small>
                                    </div>
                                </div>
                                <hr />
                                <small className="text-muted">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Dados baseados nos serviços associados aos projetos
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'projetos' && (
                <div className="row">
                    <div className="col-md-8">
                        {renderGraficoLinha(stats.receitaPorMes, 'Evolução da Receita (Últimos 12 Meses)')}
                    </div>
                    <div className="col-md-4">
                        <div className="card mb-4">
                            <div className="card-header">
                                <h6 className="mb-0">Resumo de Projetos</h6>
                            </div>
                            <div className="card-body">
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span>Total de Projetos:</span>
                                        <strong>{stats.geral.totalProjetos}</strong>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span>Projetos Ativos:</span>
                                        <strong className="text-success">{stats.geral.projetosAtivos}</strong>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span>Projetos Inativos:</span>
                                        <strong className="text-danger">
                                            {stats.geral.totalProjetos - stats.geral.projetosAtivos}
                                        </strong>
                                    </div>
                                </div>
                                <hr />
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span>Taxa de Sucesso:</span>
                                        <strong className="text-info">
                                            {stats.geral.totalProjetos > 0
                                                ? ((stats.geral.projetosAtivos / stats.geral.totalProjetos) * 100).toFixed(1)
                                                : 0
                                            }%
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {renderGraficoBarra(stats.projetosPorEstado, 'Distribuição por Estado')}
                    </div>
                </div>
            )}

            {activeTab === 'financeiro' && (
                <div>
                    {/* Cartões Financeiros */}
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <div className="card text-white bg-success">
                                <div className="card-header">
                                    <i className="bi bi-arrow-up-circle me-2"></i>
                                    Receita Total
                                </div>
                                <div className="card-body">
                                    <h4 className="card-title">€{stats.geral.receitaTotal.toFixed(2)}</h4>
                                    <p className="card-text">
                                        <small>Total faturado em projetos</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card text-white bg-danger">
                                <div className="card-header">
                                    <i className="bi bi-arrow-down-circle me-2"></i>
                                    Custo Total
                                </div>
                                <div className="card-body">
                                    <h4 className="card-title">€{stats.geral.custoTotal.toFixed(2)}</h4>
                                    <p className="card-text">
                                        <small>Total de custos operacionais</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card text-white" style={{ backgroundColor: stats.geral.lucroTotal >= 0 ? '#28a745' : '#dc3545' }}>
                                <div className="card-header">
                                    <i className={`bi ${stats.geral.lucroTotal >= 0 ? 'bi-trophy' : 'bi-exclamation-triangle'} me-2`}></i>
                                    Lucro/Prejuízo
                                </div>
                                <div className="card-body">
                                    <h4 className="card-title">€{stats.geral.lucroTotal.toFixed(2)}</h4>
                                    <p className="card-text">
                                        <small>
                                            Margem: {stats.geral.receitaTotal > 0
                                                ? ((stats.geral.lucroTotal / stats.geral.receitaTotal) * 100).toFixed(1)
                                                : 0
                                            }%
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Gráficos Financeiros */}
                    <div className="row">
                        <div className="col-md-8">
                            {renderGraficoLinha(stats.receitaPorMes, 'Evolução Financeira Mensal')}
                        </div>
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="mb-0">Indicadores Financeiros</h6>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <small className="text-muted">Ticket Médio por Projeto</small>
                                        <h5 className="text-primary">
                                            €{stats.geral.totalProjetos > 0
                                                ? (stats.geral.receitaTotal / stats.geral.totalProjetos).toFixed(2)
                                                : '0.00'
                                            }
                                        </h5>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">Receita por Cliente</small>
                                        <h5 className="text-info">
                                            €{stats.geral.totalClientes > 0
                                                ? (stats.geral.receitaTotal / stats.geral.totalClientes).toFixed(2)
                                                : '0.00'
                                            }
                                        </h5>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">Projetos por Cliente</small>
                                        <h5 className="text-warning">
                                            {stats.geral.totalClientes > 0
                                                ? (stats.geral.totalProjetos / stats.geral.totalClientes).toFixed(1)
                                                : '0.0'
                                            }
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstatisticasManager;
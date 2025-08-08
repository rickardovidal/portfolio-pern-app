
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DashboardGraphics = () => {
    const [stats, setStats] = useState({
        projetosPorEstado: [],
        clientesPorTipo: [],
        receitaUltimos6Meses: [],
        servicosMaisUsados: [],
        tendencias: {}
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            
            const [projetosRes, clientesRes, servicosRes, tiposClientesRes, estadosRes, tiposServicosRes] = await Promise.all([
                axios.get('http://localhost:3000/api/projetos'),
                axios.get('http://localhost:3000/api/clientes'),
                axios.get('http://localhost:3000/api/servicos'),
                axios.get('http://localhost:3000/api/tipos-clientes'),
                axios.get('http://localhost:3000/api/estados-projeto'),
                axios.get('http://localhost:3000/api/tipos-servicos')
            ]);

            const projetos = projetosRes.data.data || [];
            const clientes = clientesRes.data.data || [];
            const servicos = servicosRes.data.data || [];
            const tiposClientes = tiposClientesRes.data.data || [];
            const estados = estadosRes.data.data || [];
            const tiposServicos = tiposServicosRes.data.data || [];

            // Processar dados para gráficos
            processStats(projetos, clientes, servicos, tiposClientes, estados, tiposServicos);
            
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const processStats = (projetos, clientes, servicos, tiposClientes, estados, tiposServicos) => {
        // 1. Projetos por estado
        const projetosPorEstado = estados.map(estado => {
            const count = projetos.filter(p => p.idEstado_Projeto == estado.idEstado_Projeto).length;
            return {
                nome: estado.designacaoEstado_Projeto,
                count,
                percentagem: projetos.length > 0 ? ((count / projetos.length) * 100).toFixed(1) : 0,
                cor: getCorEstado(estado.designacaoEstado_Projeto)
            };
        }).filter(item => item.count > 0);

        // 2. Clientes por tipo
        const clientesPorTipo = tiposClientes.map(tipo => {
            const count = clientes.filter(c => c.idTipo_Cliente == tipo.idTipo_Cliente).length;
            return {
                nome: tipo.designacaoTipo_cliente,
                count,
                percentagem: clientes.length > 0 ? ((count / clientes.length) * 100).toFixed(1) : 0,
                cor: tipo.designacaoTipo_cliente.toLowerCase() === 'particular' ? '#17a2b8' : '#28a745'
            };
        }).filter(item => item.count > 0);

        // 3. Receita últimos 6 meses (simulado)
        const receitaUltimos6Meses = gerarReceitaUltimos6Meses(projetos);

        // 4. Serviços mais usados (baseado em tipos)
        const servicosMaisUsados = tiposServicos.map(tipo => {
            const count = servicos.filter(s => s.idTipo_Servico == tipo.idTipo_Servico).length;
            return {
                nome: tipo.designacao_TipoServico,
                count,
                cor: getCorTipoServico(tipo.designacao_TipoServico)
            };
        }).filter(item => item.count > 0).sort((a, b) => b.count - a.count).slice(0, 5);

        // 5. Tendências
        const tendencias = {
            crescimentoClientes: calcularCrescimento(clientes),
            crescimentoProjetos: calcularCrescimento(projetos),
            eficienciaServicos: servicos.filter(s => s.ativo).length / servicos.length * 100
        };

        setStats({
            projetosPorEstado,
            clientesPorTipo,
            receitaUltimos6Meses,
            servicosMaisUsados,
            tendencias
        });
    };

    const getCorEstado = (nomeEstado) => {
        switch (nomeEstado.toLowerCase()) {
            case 'concluído': return '#28a745';
            case 'em andamento': return '#007bff';
            case 'pendente': return '#ffc107';
            case 'desativado': return '#dc3545';
            default: return '#6c757d';
        }
    };

    const getCorTipoServico = (tipoNome) => {
        const nome = tipoNome.toLowerCase();
        if (nome.includes('design')) return '#dc3545';
        if (nome.includes('desenvolvimento')) return '#007bff';
        if (nome.includes('multimédia')) return '#ffc107';
        if (nome.includes('consultoria')) return '#17a2b8';
        return '#28a745';
    };

    const gerarReceitaUltimos6Meses = (projetos) => {
        const meses = [];
        const hoje = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const mes = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            const nomeMes = mes.toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' });
            
            // Calcular receita para o mês (simulado baseado em projetos)
            const projetosMes = projetos.filter(p => {
                if (!p.dataInicio) return false;
                const dataInicio = new Date(p.dataInicio);
                return dataInicio.getMonth() === mes.getMonth() && 
                       dataInicio.getFullYear() === mes.getFullYear();
            });
            
            const receita = projetosMes.reduce((total, p) => total + parseFloat(p.orcamentoTotal || 0), 0);
            
            meses.push({
                mes: nomeMes,
                receita: receita.toFixed(2),
                projetos: projetosMes.length
            });
        }
        
        return meses;
    };

    const calcularCrescimento = (dados) => {
        if (dados.length < 2) return 0;
        
        const hoje = new Date();
        const umMesAtras = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
        
        const recentes = dados.filter(item => new Date(item.createdAt) >= umMesAtras).length;
        const antigos = dados.length - recentes;
        
        return antigos > 0 ? ((recentes / antigos) * 100).toFixed(1) : 0;
    };

    if (loading) {
        return (
            <div className="text-center p-4">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">A carregar estatísticas...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            {/* Projetos por Estado */}
            <div className="col-lg-6 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h6 className="m-0 font-weight-bold text-primary">
                            <i className="bi bi-pie-chart me-2"></i>
                            Projetos por Estado
                        </h6>
                    </div>
                    <div className="card-body">
                        {stats.projetosPorEstado.map((item, index) => (
                            <div key={index} className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-sm font-weight-bold">{item.nome}</span>
                                    <span className="text-sm text-muted">{item.count} ({item.percentagem}%)</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div 
                                        className="progress-bar" 
                                        style={{ 
                                            width: `${item.percentagem}%`,
                                            backgroundColor: item.cor
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Clientes por Tipo */}
            <div className="col-lg-6 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h6 className="m-0 font-weight-bold text-primary">
                            <i className="bi bi-people me-2"></i>
                            Clientes por Tipo
                        </h6>
                    </div>
                    <div className="card-body">
                        {stats.clientesPorTipo.map((item, index) => (
                            <div key={index} className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="text-sm font-weight-bold">{item.nome}</span>
                                    <span className="text-sm text-muted">{item.count} ({item.percentagem}%)</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div 
                                        className="progress-bar" 
                                        style={{ 
                                            width: `${item.percentagem}%`,
                                            backgroundColor: item.cor
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Receita Últimos 6 Meses */}
            <div className="col-lg-8 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h6 className="m-0 font-weight-bold text-primary">
                            <i className="bi bi-graph-up me-2"></i>
                            Receita Últimos 6 Meses
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Mês</th>
                                        <th>Receita</th>
                                        <th>Projetos</th>
                                        <th>Visual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.receitaUltimos6Meses.map((item, index) => {
                                        const maxReceita = Math.max(...stats.receitaUltimos6Meses.map(m => parseFloat(m.receita)));
                                        const percentagem = maxReceita > 0 ? (parseFloat(item.receita) / maxReceita * 100) : 0;
                                        
                                        return (
                                            <tr key={index}>
                                                <td><strong>{item.mes}</strong></td>
                                                <td>€{item.receita}</td>
                                                <td>
                                                    <span className="badge bg-secondary">{item.projetos}</span>
                                                </td>
                                                <td style={{ width: '100px' }}>
                                                    <div className="progress" style={{ height: '6px' }}>
                                                        <div 
                                                            className="progress-bar bg-success" 
                                                            style={{ width: `${percentagem}%` }}
                                                        ></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Serviços Mais Usados */}
            <div className="col-lg-4 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h6 className="m-0 font-weight-bold text-primary">
                            <i className="bi bi-gear me-2"></i>
                            Tipos de Serviços
                        </h6>
                    </div>
                    <div className="card-body">
                        {stats.servicosMaisUsados.map((item, index) => (
                            <div key={index} className="d-flex align-items-center mb-3">
                                <div 
                                    className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                    style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        backgroundColor: item.cor,
                                        color: 'white'
                                    }}
                                >
                                    <strong>{item.count}</strong>
                                </div>
                                <div>
                                    <div className="font-weight-bold text-sm">{item.nome}</div>
                                    <div className="text-muted text-xs">
                                        {item.count} serviço{item.count !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tendências */}
            <div className="col-12 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h6 className="m-0 font-weight-bold text-primary">
                            <i className="bi bi-trending-up me-2"></i>
                            Tendências e Insights
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="row text-center">
                            <div className="col-md-4">
                                <div className="border-end">
                                    <div className="h4 font-weight-bold text-success">
                                        +{stats.tendencias.crescimentoClientes}%
                                    </div>
                                    <div className="text-muted">Crescimento de Clientes</div>
                                    <small className="text-xs text-muted">Último mês vs anterior</small>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="border-end">
                                    <div className="h4 font-weight-bold text-info">
                                        +{stats.tendencias.crescimentoProjetos}%
                                    </div>
                                    <div className="text-muted">Crescimento de Projetos</div>
                                    <small className="text-xs text-muted">Último mês vs anterior</small>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="h4 font-weight-bold text-warning">
                                    {stats.tendencias.eficienciaServicos.toFixed(1)}%
                                </div>
                                <div className="text-muted">Serviços Ativos</div>
                                <small className="text-xs text-muted">Eficiência do catálogo</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGraphics;
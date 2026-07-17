
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';

const DashboardGraphics = () => {
    const [stats, setStats] = useState({
        projetosPorEstado: [],
        clientesPorTipo: [],
        receitaUltimos6Meses: [],
        servicosMaisUsados: [],
        tendencias: {}
    });
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(false);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            setErro(false);

            const response = await api.get('/estatisticas');
            const data = response.data.data;

            setStats({
                projetosPorEstado: data.projetosPorEstado,
                clientesPorTipo: data.clientesPorTipo,
                receitaUltimos6Meses: data.receitaPorMes.slice(-6),
                servicosMaisUsados: data.servicosPorTipo.slice(0, 5),
                tendencias: data.tendencias
            });

        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
            setErro(true);
        } finally {
            setLoading(false);
        }
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

    if (erro) {
        return (
            <div className="alert alert-danger" role="alert">
                Erro ao carregar estatísticas. Verifica a conexão com o servidor.
            </div>
        );
    }

    return (
        <div className="row">
            {/* Projetos por Estado */}
            <div className="col-lg-6 mb-4">
                <div className="card">
                    <div className="card-header">
                        <h6 className="m-0 fw-bold text-primary">
                            <i className="bi bi-pie-chart me-2"></i>
                            Projetos por Estado
                        </h6>
                    </div>
                    <div className="card-body">
                        {stats.projetosPorEstado.map((item, index) => (
                            <div key={index} className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="small fw-bold">{item.nome}</span>
                                    <span className="small text-muted">{item.count} ({item.percentagem}%)</span>
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
                        <h6 className="m-0 fw-bold text-primary">
                            <i className="bi bi-people me-2"></i>
                            Clientes por Tipo
                        </h6>
                    </div>
                    <div className="card-body">
                        {stats.clientesPorTipo.map((item, index) => (
                            <div key={index} className="mb-3">
                                <div className="d-flex justify-content-between align-items-center mb-1">
                                    <span className="small fw-bold">{item.nome}</span>
                                    <span className="small text-muted">{item.count} ({item.percentagem}%)</span>
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
                        <h6 className="m-0 fw-bold text-primary">
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
                                        const maxReceita = Math.max(...stats.receitaUltimos6Meses.map(m => m.receita));
                                        const percentagem = maxReceita > 0 ? (item.receita / maxReceita * 100) : 0;
                                        
                                        return (
                                            <tr key={index}>
                                                <td><strong>{item.mes}</strong></td>
                                                <td>€{item.receita.toFixed(2)}</td>
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
                        <h6 className="m-0 fw-bold text-primary">
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
                                    <div className="fw-bold small">{item.nome}</div>
                                    <div className="text-muted small">
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
                        <h6 className="m-0 fw-bold text-primary">
                            <i className="bi bi-trending-up me-2"></i>
                            Tendências e Insights
                        </h6>
                    </div>
                    <div className="card-body">
                        <div className="row text-center">
                            <div className="col-md-4">
                                <div className="border-end">
                                    <div className="h4 fw-bold text-success">
                                        +{stats.tendencias.crescimentoClientes}%
                                    </div>
                                    <div className="text-muted">Crescimento de Clientes</div>
                                    <small className="small text-muted">Último mês vs anterior</small>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="border-end">
                                    <div className="h4 fw-bold text-info">
                                        +{stats.tendencias.crescimentoProjetos}%
                                    </div>
                                    <div className="text-muted">Crescimento de Projetos</div>
                                    <small className="small text-muted">Último mês vs anterior</small>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="h4 fw-bold text-warning">
                                    {stats.tendencias.eficienciaServicos.toFixed(1)}%
                                </div>
                                <div className="text-muted">Serviços Ativos</div>
                                <small className="small text-muted">Eficiência do catálogo</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardGraphics;
// AdminDashboard.jsx - VERSÃO CORRIGIDA FINAL

import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/AdminStyles.css';

// Componentes da área administrativa
import ClientesManager from './ClientesManager';
import ProjetosManager from './ProjetosManager';
import ServicosManager from './ServicosManager';
import EstatisticasManager from './EstatisticasManager';

const AdminDashboard = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [stats, setStats] = useState({
        totalClientes: 0,
        totalProjetos: 0,
        projetosAtivos: 0,
        totalServicos: 0,
        receitaTotal: 0
    });

    // Detectar tamanho da tela
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setSidebarOpen(false); // Fechar sidebar automática em desktop
            }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        // ✅ CORRIGIDO - Verificação de autenticação com POST
        const verificarAutenticacao = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                window.location.href = '/admin-login';
                return;
            }

            try {
                // ✅ CORRIGIDO - Usar POST em vez de GET
                await api.post('/auth/verify');
                setIsAuthenticated(true);
                loadDashboardStats();
            } catch (error) {
                console.error('Token inválido:', error);
                localStorage.removeItem('adminToken');
                window.location.href = '/admin-login';
            }
        };

        verificarAutenticacao();
    }, []);

    const loadDashboardStats = async () => {
        try {
            setLoading(true);
            
            const [clientesRes, projetosRes, servicosRes] = await Promise.all([
                api.get('/clientes'),
                api.get('/projetos'),
                api.get('/servicos')
            ]);

            const projetos = projetosRes.data.data || [];
            const projetosAtivos = projetos.filter(p => p.ativo === true);
            const receitaTotal = projetos.reduce((total, p) => total + parseFloat(p.orcamentoTotal || 0), 0);

            setStats({
                totalClientes: clientesRes.data.data?.length || 0,
                totalProjetos: projetos.length,
                projetosAtivos: projetosAtivos.length,
                totalServicos: servicosRes.data.data?.length || 0,
                receitaTotal: receitaTotal
            });
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('Tens a certeza que queres sair?')) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin-login';
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
        closeSidebar(); // Fechar sidebar ao mudar secção no mobile
    };

    // Função para renderizar a sidebar
    const renderSidebar = () => {
        const navItems = [
            { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
            { id: 'clientes', icon: 'bi-people', label: 'Clientes' },
            { id: 'projetos', icon: 'bi-folder', label: 'Projetos' },
            { id: 'servicos', icon: 'bi-gear', label: 'Serviços' },
            { id: 'estatisticas', icon: 'bi-graph-up', label: 'Estatísticas' }
        ];

        return (
            <>
                {/* Overlay para mobile */}
                {isMobile && sidebarOpen && (
                    <div 
                        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
                        onClick={closeSidebar}
                    ></div>
                )}

                {/* Sidebar */}
                <div className={`sidebar ${sidebarOpen ? 'show' : ''}`}>
                    <div className="position-sticky pt-3">
                        <div className="text-center mb-4">
                            <h5>Área Administrativa</h5>
                            <small>Ricardo Vidal - Portfolio</small>
                        </div>

                        <ul className="nav flex-column px-2">
                            {navItems.map((item) => (
                                <li key={item.id} className="nav-item">
                                    <button
                                        className={`nav-link w-100 ${
                                            activeSection === item.id ? 'active' : ''
                                        }`}
                                        onClick={() => handleSectionChange(item.id)}
                                    >
                                        <i className={`bi ${item.icon}`}></i>
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <hr className="text-light mx-3" />

                        <div className="px-2">
                            <button
                                className="btn btn-outline-danger btn-sm w-100"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    // Função para renderizar o dashboard overview
    const renderDashboardOverview = () => (
        <>
            {/* Botão de refresh */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Dashboard</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={loadDashboardStats}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        {loading ? 'A atualizar...' : 'Atualizar'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">A carregar...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Cards de Estatísticas Principais */}
                    <div className="row mb-4">
                        <div className="col-xl-3 col-md-6 mb-4">
                            <div className="card border-start border-primary border-4 shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                Total de Clientes
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                {stats.totalClientes}
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
                            <div className="card border-start border-success border-4 shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                Projetos Ativos
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                {stats.projetosAtivos}
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
                            <div className="card border-start border-info border-4 shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                                                Total Serviços
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                {stats.totalServicos}
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
                            <div className="card border-start border-warning border-4 shadow h-100 py-2">
                                <div className="card-body">
                                    <div className="row no-gutters align-items-center">
                                        <div className="col mr-2">
                                            <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                Receita Total
                                            </div>
                                            <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                €{stats.receitaTotal.toFixed(2)}
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

                    {/* Informações adicionais */}
                    <div className="row">
                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Informações do Sistema
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="mb-3">
                                        <small className="text-muted">Utilizador:</small>
                                        <br />
                                        <strong>Administrador</strong>
                                    </div>
                                    <div className="mb-3">
                                        <small className="text-muted">Última atualização:</small>
                                        <br />
                                        <strong>{new Date().toLocaleString('pt-PT')}</strong>
                                    </div>
                                    <hr />
                                    <div className="text-center">
                                        <small className="text-muted">
                                            Portfolio - Ricardo Vidal
                                            <br />
                                            ESTGV - IPV
                                            <br />
                                            <span className="badge bg-success mt-1">Sistema Operacional</span>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="m-0 font-weight-bold text-primary">
                                        <i className="bi bi-list-task me-2"></i>
                                        Ações Rápidas
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <div className="d-grid gap-2">
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => handleSectionChange('clientes')}
                                        >
                                            <i className="bi bi-person-plus me-2"></i>
                                            Adicionar Cliente
                                        </button>
                                        <button
                                            className="btn btn-outline-success btn-sm"
                                            onClick={() => handleSectionChange('projetos')}
                                        >
                                            <i className="bi bi-folder-plus me-2"></i>
                                            Criar Projeto
                                        </button>
                                        <button
                                            className="btn btn-outline-info btn-sm"
                                            onClick={() => handleSectionChange('servicos')}
                                        >
                                            <i className="bi bi-plus-circle me-2"></i>
                                            Adicionar Serviço
                                        </button>
                                        <button
                                            className="btn btn-outline-warning btn-sm"
                                            onClick={() => handleSectionChange('estatisticas')}
                                        >
                                            <i className="bi bi-graph-up me-2"></i>
                                            Ver Estatísticas
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'clientes':
                return <ClientesManager onStatsUpdate={loadDashboardStats} />;
            case 'projetos':
                return <ProjetosManager onStatsUpdate={loadDashboardStats} />;
            case 'servicos':
                return <ServicosManager onStatsUpdate={loadDashboardStats} />;
            case 'estatisticas':
                return <EstatisticasManager />;
            default:
                return renderDashboardOverview();
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">A verificar autenticação...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-app">
            {/* Botão do menu hambúrguer para mobile */}
            {isMobile && (
                <button
                    className="mobile-menu-toggle"
                    onClick={toggleSidebar}
                    aria-label="Toggle menu"
                >
                    <i className={`bi ${sidebarOpen ? 'bi-x' : 'bi-list'}`}></i>
                </button>
            )}

            {/* Renderizar sidebar */}
            {renderSidebar()}
            
            {/* Conteúdo principal */}
            <main className="main-content">
                {renderActiveSection()}
            </main>
        </div>
    );
};

export default AdminDashboard;
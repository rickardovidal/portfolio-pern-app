import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import NotificationService from '../services/NotificationService';

const ProjetosManager = ({ onStatsUpdate }) => {
    const [projetos, setProjetos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadosProjeto, setEstadosProjeto] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCliente, setFilterCliente] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    // DEBUG: Estados para mostrar informação na interface
    const [debugInfo, setDebugInfo] = useState('Inicializando...');
    const [showDebug, setShowDebug] = useState(true);

    const [formData, setFormData] = useState({
        nomeProjeto: '',
        descricaoProjeto: '',
        dataInicio: '',
        dataPrevista_Fim: '',
        dataFim: '',
        orcamentoTotal: '',
        notas: '',
        idCliente: '',
        idEstado_Projeto: '',
        ativo: true
    });

    const [selectedServicos, setSelectedServicos] = useState([]);
    const [errors, setErrors] = useState({});

    // Função para actualizar debug info na interface
    const updateDebug = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugInfo(prev => `${prev}\n[${timestamp}] ${message}`);
        console.log(message);
    };

    useEffect(() => {
        let isMounted = true; // Evitar race conditions

        const initData = async () => {
            try {
                updateDebug('🚀 Iniciando carregamento...');
                setLoading(true);
                
                // Teste 1: Verificar token
                const token = localStorage.getItem('adminToken');
                updateDebug(`🔑 Token existe: ${!!token} (${token ? token.length + ' chars' : 'nenhum'})`);
                
                if (!token) {
                    updateDebug('❌ ERRO: Sem token de autenticação!');
                    return;
                }

                // Teste 2: Carregar clientes PRIMEIRO
                updateDebug('📞 Fazendo requisição para /clientes...');
                const clientesResponse = await api.get('/clientes');
                updateDebug(`📡 Resposta clientes: status=${clientesResponse.status}, success=${clientesResponse.data.success}`);
                
                if (clientesResponse.data.success) {
                    const clientesData = clientesResponse.data.data || [];
                    updateDebug(`✅ Clientes recebidos: ${clientesData.length}`);
                    
                    if (clientesData.length > 0) {
                        updateDebug(`👤 Primeiro cliente: ${clientesData[0].nome} (ID: ${clientesData[0].idCliente})`);
                    }
                    
                    if (isMounted) {
                        setClientes(clientesData);
                        updateDebug(`💾 Estado clientes actualizado no React`);
                    }
                } else {
                    updateDebug(`❌ ERRO: API clientes retornou success=false`);
                }

                // Teste 3: Carregar outros dados
                updateDebug('📞 Carregando estados de projeto...');
                const estadosResponse = await api.get('/estados-projeto');
                if (estadosResponse.data.success && isMounted) {
                    setEstadosProjeto(estadosResponse.data.data || []);
                    updateDebug(`✅ Estados carregados: ${estadosResponse.data.data?.length || 0}`);
                }

                updateDebug('📞 Carregando serviços...');
                const servicosResponse = await api.get('/servicos');
                if (servicosResponse.data.success && isMounted) {
                    setServicos(servicosResponse.data.data || []);
                    updateDebug(`✅ Serviços carregados: ${servicosResponse.data.data?.length || 0}`);
                }

                // Teste 4: Carregar projetos POR ÚLTIMO
                updateDebug('📞 Fazendo requisição para /projetos...');
                const projetosResponse = await api.get('/projetos');
                updateDebug(`📡 Resposta projetos: status=${projetosResponse.status}, success=${projetosResponse.data.success}`);
                
                if (projetosResponse.data.success) {
                    const projetosData = projetosResponse.data.data || [];
                    updateDebug(`✅ Projetos recebidos: ${projetosData.length}`);
                    
                    if (projetosData.length > 0) {
                        const primeiroProject = projetosData[0];
                        updateDebug(`📁 Primeiro projeto: "${primeiroProject.nomeProjeto}"`);
                        updateDebug(`🔗 ID Cliente: ${primeiroProject.idCliente}`);
                        updateDebug(`👤 Tem associação cliente: ${!!primeiroProject.cliente}`);
                        updateDebug(`📝 Nome via associação: ${primeiroProject.cliente?.nome || 'NENHUM'}`);
                    }
                    
                    if (isMounted) {
                        setProjetos(projetosData);
                        updateDebug(`💾 Estado projetos actualizado no React`);
                    }
                } else {
                    updateDebug(`❌ ERRO: API projetos retornou success=false`);
                }

                updateDebug('🎉 Carregamento completo!');

            } catch (error) {
                updateDebug(`💥 ERRO CRÍTICO: ${error.message}`);
                if (error.response) {
                    updateDebug(`📊 Status HTTP: ${error.response.status}`);
                    updateDebug(`📋 Dados do erro: ${JSON.stringify(error.response.data)}`);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                    updateDebug('⏹️ Loading concluído');
                }
            }
        };

        initData();

        // Cleanup para evitar memory leaks
        return () => {
            isMounted = false;
        };
    }, []); // Array vazio para executar apenas uma vez

    // Função simplificada para obter nome do cliente
    const getClienteNome = (projeto) => {
        updateDebug(`🔍 getClienteNome chamado para projeto: ${projeto.nomeProjeto}`);
        
        // Estratégia 1: Associação do backend
        if (projeto.cliente && projeto.cliente.nome) {
            updateDebug(`✅ Nome encontrado via backend: ${projeto.cliente.nome}`);
            return projeto.cliente.nome;
        }
        
        // Estratégia 2: Lista local
        if (clientes.length > 0) {
            const clienteLocal = clientes.find(c => c.idCliente === projeto.idCliente);
            if (clienteLocal) {
                updateDebug(`✅ Nome encontrado na lista local: ${clienteLocal.nome}`);
                return clienteLocal.nome;
            } else {
                updateDebug(`❌ Cliente não encontrado na lista local (ID: ${projeto.idCliente})`);
                updateDebug(`📋 Clientes disponíveis: ${clientes.map(c => `${c.idCliente}:${c.nome}`).join(', ')}`);
            }
        } else {
            updateDebug(`⚠️ Lista de clientes está vazia!`);
        }
        
        updateDebug(`❌ Retornando N/A para projeto: ${projeto.nomeProjeto}`);
        return 'N/A';
    };

    // Teste manual forçado
    const testeManual = async () => {
        updateDebug('🧪 === TESTE MANUAL INICIADO ===');
        
        try {
            // Limpar estados
            setClientes([]);
            setProjetos([]);
            updateDebug('🧹 Estados limpos');
            
            // Fazer requisições frescas
            const [clientesRes, projetosRes] = await Promise.all([
                api.get('/clientes'),
                api.get('/projetos')
            ]);
            
            updateDebug(`📊 Clientes API: ${clientesRes.data.success} - ${clientesRes.data.data?.length || 0} itens`);
            updateDebug(`📊 Projetos API: ${projetosRes.data.success} - ${projetosRes.data.data?.length || 0} itens`);
            
            if (clientesRes.data.success) {
                setClientes(clientesRes.data.data);
                updateDebug(`💾 Clientes definidos no estado: ${clientesRes.data.data.length}`);
            }
            
            if (projetosRes.data.success) {
                setProjetos(projetosRes.data.data);
                updateDebug(`💾 Projetos definidos no estado: ${projetosRes.data.data.length}`);
            }
            
            updateDebug('🧪 === TESTE MANUAL COMPLETO ===');
            
        } catch (error) {
            updateDebug(`💥 Erro no teste manual: ${error.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleServicoChange = (servicoId) => {
        setSelectedServicos(prev => {
            if (prev.includes(servicoId)) {
                return prev.filter(id => id !== servicoId);
            } else {
                return [...prev, servicoId];
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nomeProjeto.trim()) {
            newErrors.nomeProjeto = 'Nome do projeto é obrigatório';
        } else if (formData.nomeProjeto.length < 3) {
            newErrors.nomeProjeto = 'Nome deve ter pelo menos 3 caracteres';
        }

        if (!formData.idCliente) {
            newErrors.idCliente = 'Cliente é obrigatório';
        }

        if (!formData.idEstado_Projeto) {
            newErrors.idEstado_Projeto = 'Estado do projeto é obrigatório';
        }

        if (!formData.orcamentoTotal || formData.orcamentoTotal <= 0) {
            newErrors.orcamentoTotal = 'Orçamento total deve ser maior que 0';
        }

        if (formData.dataInicio && formData.dataPrevista_Fim) {
            const dataInicio = new Date(formData.dataInicio);
            const dataFim = new Date(formData.dataPrevista_Fim);
            if (dataFim <= dataInicio) {
                newErrors.dataPrevista_Fim = 'Data prevista de fim deve ser posterior à data de início';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            NotificationService.validationError('Preenche todos os campos obrigatórios!');
            return;
        }

        try {
            NotificationService.loading(editingProject ? 'A atualizar projeto...' : 'A criar projeto...');

            const projetoData = {
                ...formData,
                servicos: selectedServicos,
                orcamentoTotal: calcularOrcamentoTotal()
            };

            let response;
            if (editingProject) {
                response = await api.put(`/projetos/${editingProject.idProjeto}`, projetoData);
            } else {
                response = await api.post('/projetos', projetoData);
            }

            if (response.data.success) {
                NotificationService.closeLoading();

                if (editingProject) {
                    NotificationService.updateSuccess('Projeto');
                } else {
                    NotificationService.createSuccess('Projeto');
                }

                handleCloseModal();
                // Recarregar dados após criar/editar
                await testeManual();
                if (onStatsUpdate) onStatsUpdate();
            }
        } catch (error) {
            updateDebug(`❌ Erro ao guardar projeto: ${error.message}`);
            NotificationService.closeLoading();

            if (error.response?.data?.message) {
                NotificationService.error('Erro!', error.response.data.message);
            } else {
                NotificationService.errorToast('Erro ao guardar projeto');
            }
        }
    };

    const handleEdit = async (projeto) => {
        setEditingProject(projeto);
        setFormData({
            nomeProjeto: projeto.nomeProjeto || '',
            descricaoProjeto: projeto.descricaoProjeto || '',
            dataInicio: projeto.dataInicio ? projeto.dataInicio.split('T')[0] : '',
            dataPrevista_Fim: projeto.dataPrevista_Fim ? projeto.dataPrevista_Fim.split('T')[0] : '',
            dataFim: projeto.dataFim ? projeto.dataFim.split('T')[0] : '',
            orcamentoTotal: projeto.orcamentoTotal || 0,
            notas: projeto.notas || '',
            idCliente: projeto.idCliente || '',
            idEstado_Projeto: projeto.idEstado_Projeto || '',
            ativo: projeto.ativo !== undefined ? projeto.ativo : true
        });

        try {
            const response = await api.get(`/projetos-servicos/projeto/${projeto.idProjeto}`);
            if (response.data.success) {
                const servicosAssociados = response.data.data.map(ps => ps.idServico);
                setSelectedServicos(servicosAssociados);
            }
        } catch (error) {
            updateDebug(`❌ Erro ao carregar serviços do projeto: ${error.message}`);
            setSelectedServicos([]);
        }

        setShowModal(true);
    };

    const handleToggleStatus = async (projeto) => {
        const novoStatus = !projeto.ativo;
        const acao = novoStatus ? 'ativar' : 'desativar';

        const result = await NotificationService.confirm(
            `Tens a certeza?`,
            `Queres ${acao} o projeto "${projeto.nomeProjeto}"?`,
            `Sim, ${acao}!`,
            'Cancelar'
        );

        if (result.isConfirmed) {
            try {
                let estadoId = projeto.idEstado_Projeto;
                if (!novoStatus) {
                    const estadoDesativado = estadosProjeto.find(e =>
                        e.designacaoEstado_Projeto.toLowerCase() === 'desativado'
                    );
                    if (estadoDesativado) {
                        estadoId = estadoDesativado.idEstado_Projeto;
                    }
                }

                const response = await api.put(`/projetos/${projeto.idProjeto}`, {
                    ...projeto,
                    ativo: novoStatus,
                    idEstado_Projeto: estadoId
                });

                if (response.data.success) {
                    NotificationService.successToast(`Projeto ${novoStatus ? 'ativado' : 'desativado'}!`);
                    await testeManual();
                    if (onStatsUpdate) onStatsUpdate();
                }
            } catch (error) {
                updateDebug(`❌ Erro ao alterar estado do projeto: ${error.message}`);
                NotificationService.errorToast('Erro ao alterar estado do projeto');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData({
            nomeProjeto: '',
            descricaoProjeto: '',
            dataInicio: '',
            dataPrevista_Fim: '',
            dataFim: '',
            orcamentoTotal: 0,
            notas: '',
            idCliente: '',
            idEstado_Projeto: '',
            ativo: true
        });
        setSelectedServicos([]);
        setErrors({});
    };

    const filteredProjetos = projetos.filter(projeto => {
        const matchesSearch = projeto.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (projeto.descricaoProjeto && projeto.descricaoProjeto.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = !filterStatus ||
            (filterStatus === 'ativo' && projeto.ativo === true) ||
            (filterStatus === 'inativo' && projeto.ativo === false);

        const matchesEstado = !filterEstado || projeto.idEstado_Projeto == filterEstado;
        const matchesCliente = !filterCliente || projeto.idCliente == filterCliente;

        return matchesSearch && matchesStatus && matchesEstado && matchesCliente;
    });

    const getEstadoNome = (idEstado) => {
        const estado = estadosProjeto.find(e => e.idEstado_Projeto == idEstado);
        return estado ? estado.designacaoEstado_Projeto : 'N/A';
    };

    const getStatusBadgeClass = (ativo) => {
        return ativo ? 'bg-success' : 'bg-danger';
    };

    const getEstadoBadgeClass = (nomeEstado) => {
        switch (nomeEstado?.toLowerCase()) {
            case 'concluído': return 'bg-success';
            case 'em andamento': return 'bg-primary';
            case 'pendente': return 'bg-warning';
            case 'desativado': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };

    const calcularOrcamentoTotal = () => {
        let total = 0;
        selectedServicos.forEach(servicoId => {
            const servico = servicos.find(s => s.idServico == servicoId);
            if (servico) {
                total += parseFloat(servico.preco_base_servico || 0);
            }
        });
        return total.toFixed(2);
    };

    useEffect(() => {
        const novoOrcamento = calcularOrcamentoTotal();
        setFormData(prev => ({
            ...prev,
            orcamentoTotal: novoOrcamento
        }));
    }, [selectedServicos, servicos]);

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Gestão de Projetos</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-folder-plus me-2"></i>
                        Criar Projeto
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-success me-2"
                        onClick={testeManual}
                        title="Teste manual forçado"
                    >
                        🧪 Teste Manual
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-info me-2"
                        onClick={() => setShowDebug(!showDebug)}
                        title="Mostrar/ocultar debug"
                    >
                        {showDebug ? '🙈' : '👁️'} Debug
                    </button>
                </div>
            </div>

            {/* ÁREA DE DEBUG VISÍVEL NA INTERFACE */}
            {showDebug && (
                <div className="card mb-3 border-warning">
                    <div className="card-header bg-warning text-dark">
                        <h6 className="mb-0">🔧 Informações de Debug em Tempo Real</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-6">
                                <h6>📊 Estados Actuais:</h6>
                                <ul className="list-unstyled">
                                    <li>✅ Clientes: <strong>{clientes.length}</strong></li>
                                    <li>✅ Projetos: <strong>{projetos.length}</strong></li>
                                    <li>✅ Estados: <strong>{estadosProjeto.length}</strong></li>
                                    <li>✅ Serviços: <strong>{servicos.length}</strong></li>
                                </ul>
                            </div>
                            <div className="col-md-6">
                                <h6>🧪 Teste Rápido:</h6>
                                {projetos.length > 0 && (
                                    <div>
                                        <strong>Primeiro projeto:</strong> {projetos[0].nomeProjeto}<br />
                                        <strong>Cliente ID:</strong> {projetos[0].idCliente}<br />
                                        <strong>Nome resolvido:</strong> <span className="badge bg-primary">{getClienteNome(projetos[0])}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <hr />
                        <h6>📋 Log de Eventos:</h6>
                        <textarea 
                            className="form-control" 
                            value={debugInfo} 
                            readOnly 
                            rows="8"
                            style={{ fontSize: '0.75em', fontFamily: 'monospace' }}
                        />
                    </div>
                </div>
            )}

            <div className="row mb-3">
                <div className="col-md-3">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar projetos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Status (Ativo/Inativo)</option>
                        <option value="ativo">Apenas Ativos</option>
                        <option value="inativo">Apenas Inativos</option>
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                    >
                        <option value="">Todos os Estados</option>
                        {estadosProjeto.map(estado => (
                            <option key={estado.idEstado_Projeto} value={estado.idEstado_Projeto}>
                                {estado.designacaoEstado_Projeto}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterCliente}
                        onChange={(e) => setFilterCliente(e.target.value)}
                    >
                        <option value="">
                            {clientes.length === 0 ? 'Nenhum cliente carregado!' : `Todos os Clientes (${clientes.length})`}
                        </option>
                        {clientes.map(cliente => (
                            <option key={cliente.idCliente} value={cliente.idCliente}>
                                {cliente.nome}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Lista de Projetos */}
            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">A carregar...</span>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">
                            Lista de Projetos
                            <span className="badge bg-primary ms-2">{filteredProjetos.length}</span>
                            {clientes.length > 0 && (
                                <span className="badge bg-success ms-2">{clientes.length} clientes</span>
                            )}
                        </h5>
                    </div>
                    <div className="card-body p-0">
                        {filteredProjetos.length === 0 ? (
                            <div className="text-center p-4">
                                <i className="bi bi-folder-x fa-3x text-muted mb-3"></i>
                                <p className="text-muted">
                                    {searchTerm || filterStatus || filterCliente ? 'Nenhum projeto encontrado com os filtros aplicados.' : 'Ainda não tens projetos criados.'}
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Projeto</th>
                                            <th>Cliente</th>
                                            <th>Estado</th>
                                            <th>Orçamento</th>
                                            <th>Data Início</th>
                                            <th>Data Fim Prevista</th>
                                            <th>Status</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjetos.map(projeto => (
                                            <tr key={projeto.idProjeto}>
                                                <td>
                                                    <div>
                                                        <strong>{projeto.nomeProjeto}</strong>
                                                        {projeto.descricaoProjeto && (
                                                            <small className="d-block text-muted">
                                                                {projeto.descricaoProjeto.substring(0, 100)}
                                                                {projeto.descricaoProjeto.length > 100 ? '...' : ''}
                                                            </small>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <strong className="text-primary">
                                                        {getClienteNome(projeto)}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <span className={`badge ${getEstadoBadgeClass(getEstadoNome(projeto.idEstado_Projeto))}`}>
                                                        {getEstadoNome(projeto.idEstado_Projeto)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <strong>€{parseFloat(projeto.orcamentoTotal || 0).toFixed(2)}</strong>
                                                </td>
                                                <td>
                                                    {projeto.dataInicio ? (
                                                        <small>{new Date(projeto.dataInicio).toLocaleDateString('pt-PT')}</small>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    {projeto.dataPrevista_Fim ? (
                                                        <small>{new Date(projeto.dataPrevista_Fim).toLocaleDateString('pt-PT')}</small>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${getStatusBadgeClass(projeto.ativo)}`}>
                                                        {projeto.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="text-center">
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEdit(projeto)}
                                                            title="Editar projeto"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className={`btn btn-sm ${projeto.ativo ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                                            onClick={() => handleToggleStatus(projeto)}
                                                            title={projeto.ativo ? 'Desativar projeto' : 'Ativar projeto'}
                                                        >
                                                            <i className={`bi ${projeto.ativo ? 'bi-pause' : 'bi-play'}`}></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal permanece igual... */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingProject ? 'Editar Projeto' : 'Criar Novo Projeto'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label htmlFor="nomeProjeto" className="form-label">
                                                Nome do Projeto <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.nomeProjeto ? 'is-invalid' : ''}`}
                                                id="nomeProjeto"
                                                name="nomeProjeto"
                                                value={formData.nomeProjeto}
                                                onChange={handleInputChange}
                                                placeholder="Nome do projeto"
                                            />
                                            {errors.nomeProjeto && <div className="invalid-feedback">{errors.nomeProjeto}</div>}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Orçamento Total (Calculado)</label>
                                            <div className="input-group">
                                                <span className="input-group-text">€</span>
                                                <input
                                                    type="text"
                                                    className="form-control bg-light"
                                                    value={calcularOrcamentoTotal()}
                                                    disabled
                                                    title="Calculado automaticamente com base nos serviços selecionados"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="descricaoProjeto" className="form-label">Descrição do Projeto</label>
                                        <textarea
                                            className="form-control"
                                            id="descricaoProjeto"
                                            name="descricaoProjeto"
                                            rows="3"
                                            value={formData.descricaoProjeto}
                                            onChange={handleInputChange}
                                            placeholder="Descrição detalhada do projeto"
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="idCliente" className="form-label">
                                                Cliente <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.idCliente ? 'is-invalid' : ''}`}
                                                id="idCliente"
                                                name="idCliente"
                                                value={formData.idCliente}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">
                                                    {clientes.length === 0 ? 'Nenhum cliente disponível' : 'Seleciona o cliente'}
                                                </option>
                                                {clientes.map(cliente => (
                                                    <option key={cliente.idCliente} value={cliente.idCliente}>
                                                        {cliente.nome} - {cliente.email}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idCliente && <div className="invalid-feedback">{errors.idCliente}</div>}
                                            {clientes.length === 0 && (
                                                <small className="text-warning">
                                                    ⚠️ Nenhum cliente carregado. Clica em "Teste Manual".
                                                </small>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="idEstado_Projeto" className="form-label">
                                                Estado do Projeto <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.idEstado_Projeto ? 'is-invalid' : ''}`}
                                                id="idEstado_Projeto"
                                                name="idEstado_Projeto"
                                                value={formData.idEstado_Projeto}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleciona o estado</option>
                                                {estadosProjeto.map(estado => (
                                                    <option key={estado.idEstado_Projeto} value={estado.idEstado_Projeto}>
                                                        {estado.designacaoEstado_Projeto}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idEstado_Projeto && <div className="invalid-feedback">{errors.idEstado_Projeto}</div>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="dataInicio" className="form-label">Data de Início</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="dataInicio"
                                                name="dataInicio"
                                                value={formData.dataInicio}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="dataPrevista_Fim" className="form-label">Data Prevista de Fim</label>
                                            <input
                                                type="date"
                                                className={`form-control ${errors.dataPrevista_Fim ? 'is-invalid' : ''}`}
                                                id="dataPrevista_Fim"
                                                name="dataPrevista_Fim"
                                                value={formData.dataPrevista_Fim}
                                                onChange={handleInputChange}
                                            />
                                            {errors.dataPrevista_Fim && <div className="invalid-feedback">{errors.dataPrevista_Fim}</div>}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="dataFim" className="form-label">Data de Fim</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                id="dataFim"
                                                name="dataFim"
                                                value={formData.dataFim}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">
                                            Serviços Associados
                                            <span className="badge bg-info ms-2">{selectedServicos.length}</span>
                                        </label>
                                        <div className="row">
                                            {servicos.map(servico => (
                                                <div key={servico.idServico} className="col-md-6 mb-2">
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`servico-${servico.idServico}`}
                                                            checked={selectedServicos.includes(servico.idServico)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedServicos([...selectedServicos, servico.idServico]);
                                                                } else {
                                                                    setSelectedServicos(selectedServicos.filter(id => id !== servico.idServico));
                                                                }
                                                            }}
                                                        />
                                                        <label className="form-check-label" htmlFor={`servico-${servico.idServico}`}>
                                                            <div>
                                                                <strong>{servico.designacao_servico}</strong>
                                                                <br />
                                                                <small className="text-success">
                                                                    €{parseFloat(servico.preco_base_servico || 0).toFixed(2)}
                                                                </small>
                                                            </div>
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {servicos.length === 0 && (
                                            <p className="text-muted">Nenhum serviço disponível. Cria serviços primeiro.</p>
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="notas" className="form-label">Notas</label>
                                        <textarea
                                            className="form-control"
                                            id="notas"
                                            name="notas"
                                            rows="2"
                                            value={formData.notas}
                                            onChange={handleInputChange}
                                            placeholder="Notas adicionais sobre o projeto"
                                        ></textarea>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="ativo"
                                            name="ativo"
                                            checked={formData.ativo}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="ativo">
                                            Projeto ativo
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingProject ? 'Atualizar Projeto' : 'Criar Projeto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjetosManager;
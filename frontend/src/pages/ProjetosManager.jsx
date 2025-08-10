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

    // CORREÇÃO: Separar as funções de carregamento para melhor controlo
    const loadClientes = async () => {
        try {
            console.log('📥 A carregar clientes...');
            const response = await api.get('/clientes');
            console.log('Resposta clientes:', response.data);
            
            if (response.data.success) {
                const clientesData = response.data.data || [];
                setClientes(clientesData);
                console.log(`✅ ${clientesData.length} clientes carregados`);
                return clientesData;
            } else {
                console.error('❌ API clientes retornou success=false', response.data);
                NotificationService.errorToast('Erro ao carregar clientes');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro ao carregar clientes:', error);
            NotificationService.errorToast('Erro ao carregar clientes');
            return [];
        }
    };

    const loadEstadosProjeto = async () => {
        try {
            console.log('📥 A carregar estados de projeto...');
            const response = await api.get('/estados-projeto');
            
            if (response.data.success) {
                const estadosData = response.data.data || [];
                setEstadosProjeto(estadosData);
                console.log(`✅ ${estadosData.length} estados carregados`);
                return estadosData;
            } else {
                console.error('❌ API estados-projeto retornou success=false');
                NotificationService.errorToast('Erro ao carregar estados de projeto');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro ao carregar estados:', error);
            NotificationService.errorToast('Erro ao carregar estados de projeto');
            return [];
        }
    };

    const loadServicos = async () => {
        try {
            console.log('📥 A carregar serviços...');
            const response = await api.get('/servicos');
            
            if (response.data.success) {
                const servicosData = response.data.data || [];
                setServicos(servicosData);
                console.log(`✅ ${servicosData.length} serviços carregados`);
                return servicosData;
            } else {
                console.error('❌ API servicos retornou success=false');
                NotificationService.errorToast('Erro ao carregar serviços');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro ao carregar serviços:', error);
            NotificationService.errorToast('Erro ao carregar serviços');
            return [];
        }
    };

    const loadProjetos = async () => {
        try {
            console.log('📥 A carregar projetos...');
            const response = await api.get('/projetos');
            
            if (response.data.success) {
                const projetosData = response.data.data || [];
                setProjetos(projetosData);
                console.log(`✅ ${projetosData.length} projetos carregados`);
                return projetosData;
            } else {
                console.error('❌ API projetos retornou success=false');
                NotificationService.errorToast('Erro ao carregar projetos');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro ao carregar projetos:', error);
            NotificationService.errorToast('Erro ao carregar projetos');
            return [];
        }
    };

    // CORREÇÃO: Função initData melhorada com carregamento sequencial
    const initData = async () => {
        try {
            setLoading(true);
            NotificationService.loading('A carregar dados...');

            // IMPORTANTE: Carregar dados sequencialmente para evitar problemas de concorrência
            console.log('🚀 Iniciando carregamento de dados...');
            
            // 1. Primeiro carregar clientes (essencial para mostrar nos projetos)
            const clientesCarregados = await loadClientes();
            
            // 2. Depois carregar estados de projeto
            const estadosCarregados = await loadEstadosProjeto();
            
            // 3. Carregar serviços
            const servicosCarregados = await loadServicos();
            
            // 4. Por fim, carregar projetos
            const projetosCarregados = await loadProjetos();

            // Verificar se conseguimos carregar pelo menos os dados essenciais
            if (clientesCarregados.length === 0) {
                console.warn('⚠️ Nenhum cliente foi carregado');
            }

            NotificationService.closeLoading();
            NotificationService.successToast('Dados carregados com sucesso!');

        } catch (error) {
            console.error('❌ Erro crítico ao carregar dados:', error);
            NotificationService.closeLoading();
            if (error.response?.data?.message) {
                NotificationService.error('Erro!', error.response.data.message);
            } else {
                NotificationService.errorToast('Erro ao carregar dados');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Verificar se temos token antes de carregar dados
        const token = localStorage.getItem('adminToken');
        if (!token) {
            console.error('❌ Token não encontrado!');
            NotificationService.error('Erro', 'Sessão expirada. Por favor, faça login novamente.');
            window.location.href = '/admin-login';
            return;
        }
        
        initData();
    }, []);

    // CORREÇÃO: Função melhorada para obter nome do cliente
    const getClienteNome = (projeto) => {
        if (!projeto) return 'N/A';
        
        // Debug: verificar dados do projeto
        console.log('Projeto:', projeto.idProjeto, 'idCliente:', projeto.idCliente);
        
        // Estratégia 1: Verificar se o backend já enviou o cliente aninhado
        if (projeto.cliente && projeto.cliente.nome) {
            return projeto.cliente.nome;
        }
        
        // Estratégia 2: Procurar na lista local de clientes
        if (clientes && clientes.length > 0) {
            const clienteLocal = clientes.find(c => c.idCliente === projeto.idCliente);
            if (clienteLocal) {
                return clienteLocal.nome;
            }
        }
        
        // Debug: se não encontrou, mostrar porquê
        console.warn(`Cliente não encontrado para projeto ${projeto.nomeProjeto} (idCliente: ${projeto.idCliente})`);
        return 'N/A';
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

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nomeProjeto.trim()) {
            newErrors.nomeProjeto = 'Nome do projeto é obrigatório';
        }

        if (!formData.idCliente) {
            newErrors.idCliente = 'Cliente é obrigatório';
        }

        if (!formData.idEstado_Projeto) {
            newErrors.idEstado_Projeto = 'Estado do projeto é obrigatório';
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
                orcamentoTotal: formData.orcamentoTotal || 0
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
                await initData(); // Recarregar dados após criar/editar
                if (onStatsUpdate) onStatsUpdate();
            }
        } catch (error) {
            console.error('Erro ao guardar projeto:', error);
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
            console.error('Erro ao carregar serviços do projeto:', error);
            setSelectedServicos([]);
        }

        setShowModal(true);
    };

    const handleToggleStatus = async (projeto) => {
        const novoStatus = !projeto.ativo;
        const acao = novoStatus ? 'ativar' : 'desativar';

        const result = await NotificationService.confirmAction(
            `${acao.charAt(0).toUpperCase() + acao.slice(1)} Projeto`,
            `Tens a certeza que queres ${acao} o projeto "${projeto.nomeProjeto}"?`
        );

        if (result.isConfirmed) {
            try {
                NotificationService.loading(`A ${acao} projeto...`);

                const response = await api.put(`/projetos/${projeto.idProjeto}`, {
                    ...projeto,
                    ativo: novoStatus
                });

                if (response.data.success) {
                    NotificationService.closeLoading();
                    NotificationService.successToast(`Projeto ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`);
                    await initData();
                    if (onStatsUpdate) onStatsUpdate();
                }
            } catch (error) {
                console.error('Erro ao alterar status:', error);
                NotificationService.closeLoading();
                NotificationService.errorToast(`Erro ao ${acao} projeto`);
            }
        }
    };

    const handleDelete = async (projeto) => {
        const result = await NotificationService.confirmDelete(
            'Eliminar Projeto',
            `Tens a certeza que queres eliminar o projeto "${projeto.nomeProjeto}"? Esta ação não pode ser desfeita.`
        );

        if (result.isConfirmed) {
            try {
                NotificationService.loading('A eliminar projeto...');

                const response = await api.delete(`/projetos/${projeto.idProjeto}`);

                if (response.data.success) {
                    NotificationService.closeLoading();
                    NotificationService.deleteSuccess('Projeto');
                    await initData();
                    if (onStatsUpdate) onStatsUpdate();
                }
            } catch (error) {
                console.error('Erro ao eliminar projeto:', error);
                NotificationService.closeLoading();
                if (error.response?.data?.message) {
                    NotificationService.error('Erro!', error.response.data.message);
                } else {
                    NotificationService.errorToast('Erro ao eliminar projeto. Pode ter faturas ou tarefas associadas.');
                }
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
            orcamentoTotal: '',
            notas: '',
            idCliente: '',
            idEstado_Projeto: '',
            ativo: true
        });
        setSelectedServicos([]);
        setErrors({});
    };

    const handleOpenModal = () => {
        // IMPORTANTE: Verificar se temos clientes antes de abrir o modal
        if (clientes.length === 0) {
            NotificationService.error('Atenção!', 'Precisas de criar pelo menos um cliente antes de criar um projeto.');
            return;
        }
        setShowModal(true);
    };

    const handleServicoToggle = (servicoId) => {
        setSelectedServicos(prev => {
            if (prev.includes(servicoId)) {
                return prev.filter(id => id !== servicoId);
            } else {
                return [...prev, servicoId];
            }
        });
    };

    // Filtros
    const filteredProjetos = projetos.filter(projeto => {
        const matchesSearch = projeto.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            projeto.descricaoProjeto?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = !filterStatus ||
            (filterStatus === 'ativo' && projeto.ativo) ||
            (filterStatus === 'inativo' && !projeto.ativo);

        const matchesCliente = !filterCliente || projeto.idCliente == filterCliente;
        const matchesEstado = !filterEstado || projeto.idEstado_Projeto == filterEstado;

        return matchesSearch && matchesStatus && matchesCliente && matchesEstado;
    });

    const getEstadoNome = (idEstado) => {
        const estado = estadosProjeto.find(e => e.idEstado_Projeto == idEstado);
        return estado ? estado.designacaoEstado_Projeto : 'N/A';
    };

    const getEstadoBadgeClass = (idEstado) => {
        const estado = estadosProjeto.find(e => e.idEstado_Projeto == idEstado);
        if (!estado) return 'badge bg-secondary';

        const nome = estado.designacaoEstado_Projeto.toLowerCase();
        if (nome.includes('concluído')) return 'badge bg-success';
        if (nome.includes('andamento')) return 'badge bg-primary';
        if (nome.includes('pendente')) return 'badge bg-warning';
        if (nome.includes('iniciado')) return 'badge bg-info';
        if (nome.includes('desativado')) return 'badge bg-secondary';
        return 'badge bg-secondary';
    };

    return (
        <div className="container-fluid">
            {/* Header com botão de adicionar */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestão de Projetos</h2>
                <div>
                    <button
                        className="btn btn-success me-2"
                        onClick={() => initData()}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        {loading ? 'A atualizar...' : 'Atualizar Lista'}
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleOpenModal}
                    >
                        <i className="bi bi-plus-circle me-2"></i>
                        Novo Projeto
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pesquisar projetos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterCliente}
                        onChange={(e) => setFilterCliente(e.target.value)}
                    >
                        <option value="">Todos os Clientes</option>
                        {clientes.map(cliente => (
                            <option key={cliente.idCliente} value={cliente.idCliente}>
                                {cliente.nome}
                            </option>
                        ))}
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
                <div className="col-md-2">
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Todos os Status</option>
                        <option value="ativo">Ativo</option>
                        <option value="inativo">Inativo</option>
                    </select>
                </div>
            </div>

            {/* Lista de Projetos */}
            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">A carregar...</span>
                    </div>
                    <p className="mt-2 text-muted">A carregar projetos...</p>
                </div>
            ) : projetos.length === 0 ? (
                <div className="alert alert-info text-center" role="alert">
                    Nenhum projeto encontrado. Clica em "Novo Projeto" para criar o primeiro!
                </div>
            ) : (
                <div className="card">
                    <div className="card-header">
                        <h5 className="mb-0">
                            Lista de Projetos
                            <span className="badge bg-primary ms-2">{filteredProjetos.length}</span>
                        </h5>
                    </div>
                    <div className="card-body p-0">
                        {filteredProjetos.length === 0 ? (
                            <div className="text-center p-4">
                                <i className="bi bi-folder-x fa-3x text-muted mb-3"></i>
                                <p className="text-muted">
                                    Nenhum projeto encontrado com os filtros aplicados.
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Cliente</th>
                                            <th>Estado</th>
                                            <th>Data Início</th>
                                            <th>Data Prevista</th>
                                            <th>Orçamento</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjetos.map(projeto => (
                                            <tr key={projeto.idProjeto}>
                                                <td>
                                                    <strong>{projeto.nomeProjeto}</strong>
                                                    {projeto.descricaoProjeto && (
                                                        <small className="d-block text-muted">
                                                            {projeto.descricaoProjeto.substring(0, 50)}
                                                            {projeto.descricaoProjeto.length > 50 && '...'}
                                                        </small>
                                                    )}
                                                </td>
                                                <td>{getClienteNome(projeto)}</td>
                                                <td>
                                                    <span className={getEstadoBadgeClass(projeto.idEstado_Projeto)}>
                                                        {getEstadoNome(projeto.idEstado_Projeto)}
                                                    </span>
                                                </td>
                                                <td>
                                                    {projeto.dataInicio ? 
                                                        new Date(projeto.dataInicio).toLocaleDateString('pt-PT') : 
                                                        '-'
                                                    }
                                                </td>
                                                <td>
                                                    {projeto.dataPrevista_Fim ? 
                                                        new Date(projeto.dataPrevista_Fim).toLocaleDateString('pt-PT') : 
                                                        '-'
                                                    }
                                                </td>
                                                <td>
                                                    {projeto.orcamentoTotal ? 
                                                        `€ ${parseFloat(projeto.orcamentoTotal).toFixed(2)}` : 
                                                        '-'
                                                    }
                                                </td>
                                                <td>
                                                    <span className={`badge ${projeto.ativo ? 'bg-success' : 'bg-secondary'}`}>
                                                        {projeto.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-1"
                                                        onClick={() => handleEdit(projeto)}
                                                        title="Editar"
                                                    >
                                                        <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className={`btn btn-sm ${projeto.ativo ? 'btn-outline-warning' : 'btn-outline-success'} me-1`}
                                                        onClick={() => handleToggleStatus(projeto)}
                                                        title={projeto.ativo ? 'Desativar' : 'Ativar'}
                                                    >
                                                        <i className={`bi ${projeto.ativo ? 'bi-pause-circle' : 'bi-play-circle'}`}></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(projeto)}
                                                        title="Eliminar"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
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

            {/* Modal para criar/editar projeto */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nome do Projeto *</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.nomeProjeto ? 'is-invalid' : ''}`}
                                                name="nomeProjeto"
                                                value={formData.nomeProjeto}
                                                onChange={handleInputChange}
                                            />
                                            {errors.nomeProjeto && (
                                                <div className="invalid-feedback">{errors.nomeProjeto}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Cliente *</label>
                                            <select
                                                className={`form-select ${errors.idCliente ? 'is-invalid' : ''}`}
                                                name="idCliente"
                                                value={formData.idCliente}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Selecionar cliente...</option>
                                                {clientes.map(cliente => (
                                                    <option key={cliente.idCliente} value={cliente.idCliente}>
                                                        {cliente.nome}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idCliente && (
                                                <div className="invalid-feedback">{errors.idCliente}</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Estado do Projeto *</label>
                                            <select
                                                className={`form-select ${errors.idEstado_Projeto ? 'is-invalid' : ''}`}
                                                name="idEstado_Projeto"
                                                value={formData.idEstado_Projeto}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Selecionar estado...</option>
                                                {estadosProjeto.map(estado => (
                                                    <option key={estado.idEstado_Projeto} value={estado.idEstado_Projeto}>
                                                        {estado.designacaoEstado_Projeto}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idEstado_Projeto && (
                                                <div className="invalid-feedback">{errors.idEstado_Projeto}</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Orçamento Total (€)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                name="orcamentoTotal"
                                                value={formData.orcamentoTotal}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            name="descricaoProjeto"
                                            rows="3"
                                            value={formData.descricaoProjeto}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Data Início</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="dataInicio"
                                                value={formData.dataInicio}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Data Prevista Fim</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="dataPrevista_Fim"
                                                value={formData.dataPrevista_Fim}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Data Fim</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="dataFim"
                                                value={formData.dataFim}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Serviços</label>
                                        <div className="border rounded p-2" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                            {servicos.length === 0 ? (
                                                <p className="text-muted mb-0">Nenhum serviço disponível</p>
                                            ) : (
                                                servicos.map(servico => (
                                                    <div key={servico.idServico} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`servico-${servico.idServico}`}
                                                            checked={selectedServicos.includes(servico.idServico)}
                                                            onChange={() => handleServicoToggle(servico.idServico)}
                                                        />
                                                        <label 
                                                            className="form-check-label" 
                                                            htmlFor={`servico-${servico.idServico}`}
                                                        >
                                                            {servico.nome_servico} - €{parseFloat(servico.preco_base_servico).toFixed(2)}
                                                        </label>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Notas</label>
                                        <textarea
                                            className="form-control"
                                            name="notas"
                                            rows="2"
                                            value={formData.notas}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>

                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="ativo"
                                            id="projetoAtivo"
                                            checked={formData.ativo}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="projetoAtivo">
                                            Projeto Ativo
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
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
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

    useEffect(() => {
        const initData = async () => {
            try {
                console.log('🚀 Iniciando carregamento de dados...');
                setLoading(true);
                
                // Carregar tudo em paralelo para ser mais rápido
                const [clientesRes, estadosRes, servicosRes] = await Promise.all([
                    api.get('/clientes'),
                    api.get('/estados-projeto'),
                    api.get('/servicos')
                ]);

                // Processar clientes
                if (clientesRes.data.success) {
                    const clientesData = clientesRes.data.data || [];
                    setClientes(clientesData);
                    console.log('✅ Clientes carregados:', clientesData.length);
                }

                // Processar estados
                if (estadosRes.data.success) {
                    const estadosData = estadosRes.data.data || [];
                    setEstadosProjeto(estadosData);
                    console.log('✅ Estados carregados:', estadosData.length);
                }

                // Processar serviços
                if (servicosRes.data.success) {
                    const servicosData = servicosRes.data.data || [];
                    setServicos(servicosData);
                    console.log('✅ Serviços carregados:', servicosData.length);
                }

                // Carregar projetos por último, depois dos outros dados estarem prontos
                await loadProjetos();

            } catch (error) {
                console.error('❌ Erro na inicialização:', error);
                NotificationService.errorToast('Erro ao carregar dados');
            } finally {
                setLoading(false);
            }
        };

        initData();
    }, []);

    const loadProjetos = async () => {
        try {
            console.log('🔄 Carregando projetos...');
            const response = await api.get('/projetos');

            if (response.data.success) {
                const projetosData = response.data.data || [];
                console.log('✅ Projetos carregados:', projetosData.length);
                
                // Log detalhado de cada projeto para debug
                projetosData.forEach((projeto, index) => {
                    console.log(`📁 Projeto ${index + 1}:`, {
                        nome: projeto.nomeProjeto,
                        idCliente: projeto.idCliente,
                        temCliente: !!projeto.cliente,
                        nomeCliente: projeto.cliente?.nome
                    });
                });

                setProjetos(projetosData);
                NotificationService.successToast(`${projetosData.length} projetos carregados!`);
            } else {
                console.error('❌ Erro na resposta dos projetos:', response.data);
                NotificationService.errorToast('Erro ao carregar projetos');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar projetos:', error);
            NotificationService.errorToast('Erro ao carregar projetos');
        }
    };

    const loadClientes = async () => {
        try {
            console.log('🔄 Recarregando clientes...');
            const response = await api.get('/clientes');
            
            if (response.data.success) {
                const clientesData = response.data.data || [];
                setClientes(clientesData);
                console.log('✅ Clientes recarregados:', clientesData.length);
                NotificationService.successToast(`${clientesData.length} clientes carregados!`);
            }
        } catch (error) {
            console.error('❌ Erro ao recarregar clientes:', error);
            NotificationService.errorToast('Erro ao carregar clientes');
        }
    };

    // Função simplificada para obter nome do cliente
    const getClienteNome = (projeto) => {
        // Se o projeto tem a associação cliente do backend, usar essa
        if (projeto.cliente && projeto.cliente.nome) {
            return projeto.cliente.nome;
        }
        
        // Fallback: procurar na lista local de clientes
        if (clientes.length > 0) {
            const clienteLocal = clientes.find(c => c.idCliente === projeto.idCliente);
            if (clienteLocal) {
                return clienteLocal.nome;
            }
        }
        
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
                await loadProjetos();
                if (onStatsUpdate) onStatsUpdate();
            }
        } catch (error) {
            console.error('❌ Erro ao guardar projeto:', error);
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
            console.error('❌ Erro ao carregar serviços do projeto:', error);
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
                    await loadProjetos();
                    if (onStatsUpdate) onStatsUpdate();
                }
            } catch (error) {
                console.error('❌ Erro ao alterar estado do projeto:', error);
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

    // Função de diagnóstico simplificada
    const diagnosticoSimples = () => {
        console.log('🔍 DIAGNÓSTICO SIMPLES:');
        console.log('- Clientes carregados:', clientes.length);
        console.log('- Projetos carregados:', projetos.length);
        console.log('- Estados carregados:', estadosProjeto.length);
        console.log('- Serviços carregados:', servicos.length);
        
        if (projetos.length > 0) {
            console.log('- Primeiro projeto:', projetos[0]);
            console.log('- Nome do cliente do primeiro projeto:', getClienteNome(projetos[0]));
        }
        
        alert(`Diagnóstico:
Clientes: ${clientes.length}
Projetos: ${projetos.length}
Estados: ${estadosProjeto.length}
Serviços: ${servicos.length}

Ver console para mais detalhes.`);
    };

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
                        className="btn btn-outline-info me-2"
                        onClick={diagnosticoSimples}
                        title="Diagnóstico rápido"
                    >
                        🔍 Debug
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={async () => {
                            console.log('🔄 Recarregamento manual...');
                            await loadClientes();
                            await loadProjetos();
                        }}
                        title="Recarregar dados"
                    >
                        🔄 Recarregar
                    </button>
                </div>
            </div>

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
                        <option value="">Todos os Clientes</option>
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

            {/* Modal para Adicionar/Editar Projeto */}
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
                                                    ⚠️ Nenhum cliente carregado. Clica em Recarregar.
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
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

    const initData = async () => {
        try {
            setLoading(true);
            NotificationService.loading('A carregar dados...');

            // Carregar clientes
            const clientesResponse = await api.get('/clientes');
            if (clientesResponse.data.success) {
                setClientes(clientesResponse.data.data || []);
            } else {
                console.error('Erro: API clientes retornou success=false', clientesResponse.data);
                NotificationService.errorToast('Erro ao carregar clientes');
            }

            // Carregar estados de projeto
            const estadosResponse = await api.get('/estados-projeto');
            if (estadosResponse.data.success) {
                setEstadosProjeto(estadosResponse.data.data || []);
            } else {
                console.error('Erro: API estados-projeto retornou success=false', estadosResponse.data);
                NotificationService.errorToast('Erro ao carregar estados de projeto');
            }

            // Carregar serviços
            const servicosResponse = await api.get('/servicos');
            if (servicosResponse.data.success) {
                setServicos(servicosResponse.data.data || []);
            } else {
                console.error('Erro: API servicos retornou success=false', servicosResponse.data);
                NotificationService.errorToast('Erro ao carregar serviços');
            }

            // Carregar projetos
            const projetosResponse = await api.get('/projetos');
            if (projetosResponse.data.success) {
                setProjetos(projetosResponse.data.data || []);
            } else {
                console.error('Erro: API projetos retornou success=false', projetosResponse.data);
                NotificationService.errorToast('Erro ao carregar projetos');
            }

            NotificationService.closeLoading();
            NotificationService.successToast('Dados carregados com sucesso!');

        } catch (error) {
            console.error('Erro crítico ao carregar dados:', error);
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
        initData();
    }, []);

    // Função simplificada para obter nome do cliente
    const getClienteNome = (projeto) => {
        // Estratégia 1: Associação do backend (se o backend já envia o objeto cliente aninhado)
        if (projeto.cliente && projeto.cliente.nome) {
            return projeto.cliente.nome;
        }
        
        // Estratégia 2: Procurar na lista local de clientes carregada
        const clienteLocal = clientes.find(c => c.idCliente === projeto.idCliente);
        if (clienteLocal) {
            return clienteLocal.nome;
        }
        
        // Se nenhuma das estratégias funcionar, retorna N/A
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
                // orcamentoTotal: calcularOrcamentoTotal() // Assumindo que esta função existe e é necessária
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
                    await initData(); // Recarregar dados após alterar status
                    if (onStatsUpdate) onStatsUpdate();
                }
            } catch (error) {
                console.error('Erro ao alterar estado do projeto:', error);
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

    const getEstadoProjetoNome = (idEstado) => {
        const estado = estadosProjeto.find(e => e.idEstado_Projeto == idEstado);
        return estado ? estado.designacaoEstado_Projeto : 'N/A';
    };

    const getEstadoProjetoBadgeClass = (idEstado) => {
        const estado = estadosProjeto.find(e => e.idEstado_Projeto == idEstado);
        if (!estado) return 'bg-secondary';

        switch (estado.designacaoEstado_Projeto.toLowerCase()) {
            case 'ativo':
                return 'bg-success';
            case 'concluído':
                return 'bg-primary';
            case 'pendente':
                return 'bg-warning text-dark';
            case 'cancelado':
                return 'bg-danger';
            case 'desativado':
                return 'bg-secondary';
            default:
                return 'bg-info';
        }
    };

    const calcularOrcamentoTotal = () => {
        // Implementar lógica de cálculo do orçamento total se necessário
        // Por agora, retorna o valor do formulário
        return parseFloat(formData.orcamentoTotal) || 0;
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
                        Adicionar Projeto
                    </button>
                </div>
            </div>

            {/* Filtros */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar por nome ou descrição..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
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
                    Nenhum projeto encontrado.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Projeto</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Orçamento</th>
                                <th>Data Início</th>
                                <th>Data Fim Prevista</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjetos.map(projeto => (
                                <tr key={projeto.idProjeto}>
                                    <td>
                                        <strong>{projeto.nomeProjeto}</strong><br />
                                        <small className="text-muted">{projeto.descricaoProjeto}</small>
                                    </td>
                                    <td>{getClienteNome(projeto)}</td>
                                    <td>
                                        <span className={`badge ${getEstadoProjetoBadgeClass(projeto.idEstado_Projeto)}`}>
                                            {getEstadoProjetoNome(projeto.idEstado_Projeto)}
                                        </span>
                                    </td>
                                    <td>{parseFloat(projeto.orcamentoTotal).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</td>
                                    <td>{new Date(projeto.dataInicio).toLocaleDateString('pt-PT')}</td>
                                    <td>{new Date(projeto.dataPrevista_Fim).toLocaleDateString('pt-PT')}</td>
                                    <td>
                                        <span className={`badge ${projeto.ativo ? 'bg-success' : 'bg-danger'}`}>
                                            {projeto.ativo ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-1"
                                            onClick={() => handleEdit(projeto)}
                                            title="Editar Projeto"
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            className={`btn btn-sm ${projeto.ativo ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                            onClick={() => handleToggleStatus(projeto)}
                                            title={projeto.ativo ? 'Desativar Projeto' : 'Ativar Projeto'}
                                        >
                                            <i className={`bi ${projeto.ativo ? 'bi-toggle-off' : 'bi-toggle-on'}`}></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de Adicionar/Editar Projeto */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="projectModalLabel" aria-hidden={!showModal}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="projectModalLabel">
                                {editingProject ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
                            </h5>
                            <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="nomeProjeto" className="form-label">Nome do Projeto <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.nomeProjeto ? 'is-invalid' : ''}`}
                                            id="nomeProjeto"
                                            name="nomeProjeto"
                                            value={formData.nomeProjeto}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.nomeProjeto && <div className="invalid-feedback">{errors.nomeProjeto}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="idCliente" className="form-label">Cliente <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-select ${errors.idCliente ? 'is-invalid' : ''}`}
                                            id="idCliente"
                                            name="idCliente"
                                            value={formData.idCliente}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Selecionar Cliente</option>
                                            {clientes.map(cliente => (
                                                <option key={cliente.idCliente} value={cliente.idCliente}>
                                                    {cliente.nome}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.idCliente && <div className="invalid-feedback">{errors.idCliente}</div>}
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
                                    ></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="dataInicio" className="form-label">Data Início</label>
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
                                        <label htmlFor="dataPrevista_Fim" className="form-label">Data Prevista Fim <span className="text-danger">*</span></label>
                                        <input
                                            type="date"
                                            className={`form-control ${errors.dataPrevista_Fim ? 'is-invalid' : ''}`}
                                            id="dataPrevista_Fim"
                                            name="dataPrevista_Fim"
                                            value={formData.dataPrevista_Fim}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        {errors.dataPrevista_Fim && <div className="invalid-feedback">{errors.dataPrevista_Fim}</div>}
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="dataFim" className="form-label">Data Fim Real</label>
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

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="orcamentoTotal" className="form-label">Orçamento Total <span className="text-danger">*</span></label>
                                        <input
                                            type="number"
                                            className={`form-control ${errors.orcamentoTotal ? 'is-invalid' : ''}`}
                                            id="orcamentoTotal"
                                            name="orcamentoTotal"
                                            value={formData.orcamentoTotal}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                        {errors.orcamentoTotal && <div className="invalid-feedback">{errors.orcamentoTotal}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="idEstado_Projeto" className="form-label">Estado do Projeto <span className="text-danger">*</span></label>
                                        <select
                                            className={`form-select ${errors.idEstado_Projeto ? 'is-invalid' : ''}`}
                                            id="idEstado_Projeto"
                                            name="idEstado_Projeto"
                                            value={formData.idEstado_Projeto}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Selecionar Estado</option>
                                            {estadosProjeto.map(estado => (
                                                <option key={estado.idEstado_Projeto} value={estado.idEstado_Projeto}>
                                                    {estado.designacaoEstado_Projeto}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.idEstado_Projeto && <div className="invalid-feedback">{errors.idEstado_Projeto}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Serviços Associados</label>
                                    <div className="row">
                                        {servicos.map(servico => (
                                            <div className="col-md-4" key={servico.idServico}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`servico-${servico.idServico}`}
                                                        value={servico.idServico}
                                                        checked={selectedServicos.includes(servico.idServico)}
                                                        onChange={() => handleServicoChange(servico.idServico)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`servico-${servico.idServico}`}>
                                                        {servico.nomeServico}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="notas" className="form-label">Notas</label>
                                    <textarea
                                        className="form-control"
                                        id="notas"
                                        name="notas"
                                        rows="3"
                                        value={formData.notas}
                                        onChange={handleInputChange}
                                    ></textarea>
                                </div>

                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="ativo"
                                        name="ativo"
                                        checked={formData.ativo}
                                        onChange={handleInputChange}
                                    />
                                    <label className="form-check-label" htmlFor="ativo">
                                        Projeto Ativo
                                    </label>
                                </div>

                                <div className="modal-footer d-flex justify-content-between">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingProject ? 'Guardar Alterações' : 'Criar Projeto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjetosManager;
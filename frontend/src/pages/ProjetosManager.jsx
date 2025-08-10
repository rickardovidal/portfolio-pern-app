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
        // Estratégia 1: Associação do backend
        if (projeto.cliente && projeto.cliente.nome) {
            return projeto.cliente.nome;
        }
        
        // Estratégia 2: Lista local
        const clienteLocal = clientes.find(c => c.idCliente === projeto.idCliente);
        if (clienteLocal) {
            return clienteLocal.nome;
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
                                    {searchTerm || filterCliente || filterEstado || filterStatus ? 'Nenhum projeto encontrado com os filtros aplicados.' : 'Ainda não tens projetos registados.'}
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Nome do Projeto</th>
                                            <th>Cliente</th>
                                            <th>Estado</th>
                                            <th>Orçamento</th>
                                            <th>Início</th>
                                            <th>Fim Previsto</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjetos.map(projeto => (
                                            <tr key={projeto.idProjeto}>
                                                <td>
                                                    <strong>{projeto.nomeProjeto}</strong>
                                                </td>
                                                <td>{getClienteNome(projeto)}</td>
                                                <td>
                                                    <span className={`badge ${getEstadoProjetoBadgeClass(projeto.idEstado_Projeto)}`}>
                                                        {getEstadoProjetoNome(projeto.idEstado_Projeto)}
                                                    </span>
                                                </td>
                                                <td>{parseFloat(projeto.orcamentoTotal).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}</td>
                                                <td>{projeto.dataInicio ? new Date(projeto.dataInicio).toLocaleDateString('pt-PT') : 'N/A'}</td>
                                                <td>{projeto.dataPrevista_Fim ? new Date(projeto.dataPrevista_Fim).toLocaleDateString('pt-PT') : 'N/A'}</td>
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
                                                            <i className={`bi ${projeto.ativo ? 'bi-toggle-on' : 'bi-toggle-off'}`}></i>
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
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingProject ? 'Editar Projeto' : 'Adicionar Projeto'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="nomeProjeto" className="form-label">Nome do Projeto</label>
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
                                            <label htmlFor="idCliente" className="form-label">Cliente</label>
                                            <select
                                                className={`form-select ${errors.idCliente ? 'is-invalid' : ''}`}
                                                id="idCliente"
                                                name="idCliente"
                                                value={formData.idCliente}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleciona um cliente</option>
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
                                        <label htmlFor="descricaoProjeto" className="form-label">Descrição</label>
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
                                            <label htmlFor="dataFim" className="form-label">Data de Fim (Real)</label>
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
                                            <label htmlFor="orcamentoTotal" className="form-label">Orçamento Total</label>
                                            <input
                                                type="number"
                                                className={`form-control ${errors.orcamentoTotal ? 'is-invalid' : ''}`}
                                                id="orcamentoTotal"
                                                name="orcamentoTotal"
                                                value={formData.orcamentoTotal}
                                                onChange={handleInputChange}
                                                step="0.01"
                                                min="0"
                                                required
                                            />
                                            {errors.orcamentoTotal && <div className="invalid-feedback">{errors.orcamentoTotal}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="idEstado_Projeto" className="form-label">Estado do Projeto</label>
                                            <select
                                                className={`form-select ${errors.idEstado_Projeto ? 'is-invalid' : ''}`}
                                                id="idEstado_Projeto"
                                                name="idEstado_Projeto"
                                                value={formData.idEstado_Projeto}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">Seleciona um estado</option>
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
                                    <div className="mb-3">
                                        <label className="form-label">Serviços Associados</label>
                                        <div className="d-flex flex-wrap">
                                            {servicos.map(servico => (
                                                <div key={servico.idServico} className="form-check me-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`servico-${servico.idServico}`}
                                                        value={servico.idServico}
                                                        checked={selectedServicos.includes(servico.idServico)}
                                                        onChange={() => handleServicoChange(servico.idServico)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`servico-${servico.idServico}`}>
                                                        {servico.designacaoServico}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
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
                                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                                        <button type="submit" className="btn btn-primary">{editingProject ? 'Guardar Alterações' : 'Adicionar Projeto'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjetosManager;



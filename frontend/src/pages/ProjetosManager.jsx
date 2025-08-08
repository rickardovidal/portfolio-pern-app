

import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        loadProjetos();
        loadClientes();
        loadEstadosProjeto();
        loadServicos();
    }, []);

    // ✅ CORRIGIDO - Carregamento simples com toast
    const loadProjetos = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/api/projetos');
            if (response.data.success) {
                setProjetos(response.data.data || []);
                NotificationService.successToast('Projetos carregados!');
            }
        } catch (error) {
            console.error('Erro ao carregar projetos:', error);
            NotificationService.errorToast('Erro ao carregar projetos');
        } finally {
            setLoading(false);
        }
    };

    // ✅ CORRIGIDO - Carregamento simples com toast
    const loadClientes = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/clientes');
            if (response.data.success) {
                setClientes(response.data.data || []);
                NotificationService.successToast('Clientes carregados!');
            }
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            NotificationService.errorToast('Erro ao carregar clientes');
        }
    };

    // ✅ CORRIGIDO - Carregamento simples com toast
    const loadEstadosProjeto = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/estados-projeto');
            if (response.data.success) {
                setEstadosProjeto(response.data.data || []);
                NotificationService.successToast('Estados carregados!');
            }
        } catch (error) {
            console.error('Erro ao carregar estados de projeto:', error);
            NotificationService.errorToast('Erro ao carregar estados');
        }
    };

    // ✅ CORRIGIDO - Carregamento simples com toast
    const loadServicos = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/servicos');
            if (response.data.success) {
                setServicos(response.data.data || []);
                NotificationService.successToast('Serviços carregados!');
            }
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            NotificationService.errorToast('Erro ao carregar serviços');
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

    // ✅ CORREÇÃO ADICIONAL: Melhorar handleServicoChange para debug
    const handleServicoChange = (servicoId) => {
        setSelectedServicos(prev => {
            let newSelected;
            if (prev.includes(servicoId)) {
                newSelected = prev.filter(id => id !== servicoId);
                console.log(`Serviço ${servicoId} removido. Restantes:`, newSelected);
            } else {
                newSelected = [...prev, servicoId];
                console.log(`Serviço ${servicoId} adicionado. Total:`, newSelected);
            }
            return newSelected;
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

    // ✅ CORREÇÃO: Melhorar o handleSubmit para debug
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

            // ✅ DEBUG: Log para verificar dados enviados
            console.log('Dados enviados:', {
                ...projetoData,
                servicosCount: selectedServicos.length,
                selectedServicos: selectedServicos
            });

            let response;
            if (editingProject) {
                response = await axios.put(
                    `http://localhost:3000/api/projetos/${editingProject.idProjeto}`,
                    projetoData
                );
            } else {
                response = await axios.post('http://localhost:3000/api/projetos', projetoData);
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
            console.error('Erro ao guardar projeto:', error);
            console.error('Detalhes do erro:', error.response?.data);
            NotificationService.closeLoading();

            if (error.response?.data?.message) {
                NotificationService.error('Erro!', error.response.data.message);
            } else {
                NotificationService.errorToast('Erro ao guardar projeto');
            }
        }
    };

    const associarServicos = async (projetoId) => {
        try {
            for (const servicoId of selectedServicos) {
                const servico = servicos.find(s => s.idServico == servicoId);
                if (servico) {
                    await axios.post('http://localhost:3000/api/projetos-servicos', {
                        idProjeto: projetoId,
                        idServico: servicoId,
                        quantidade: 1,
                        preco_unitario: servico.preco_servico,
                        preco_total: servico.preco_servico
                    });
                }
            }
        } catch (error) {
            console.error('Erro ao associar serviços:', error);
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

        // ✅ CORREÇÃO: Carregar serviços associados ao projeto
        try {
            const response = await axios.get(`http://localhost:3000/api/projetos-servicos/projeto/${projeto.idProjeto}`);
            if (response.data.success) {
                const servicosAssociados = response.data.data.map(ps => ps.idServico);
                setSelectedServicos(servicosAssociados);
                console.log('Serviços carregados para edição:', servicosAssociados);
            }
        } catch (error) {
            console.error('Erro ao carregar serviços do projeto:', error);
            setSelectedServicos([]); // Fallback para array vazio
        }

        setShowModal(true);
    };

    // ✅ CORRIGIDO - Toggle status com confirmação SweetAlert2
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
                // Se desativar, também mudar estado para "Desativado"
                let estadoId = projeto.idEstado_Projeto;
                if (!novoStatus) {
                    const estadoDesativado = estadosProjeto.find(e =>
                        e.designacaoEstado_Projeto.toLowerCase() === 'desativado'
                    );
                    if (estadoDesativado) {
                        estadoId = estadoDesativado.idEstado_Projeto;
                    }
                }

                const response = await axios.put(
                    `http://localhost:3000/api/projetos/${projeto.idProjeto}`,
                    {
                        ...projeto,
                        ativo: novoStatus,
                        idEstado_Projeto: estadoId
                    }
                );

                if (response.data.success) {
                    NotificationService.successToast(
                        `Projeto ${novoStatus ? 'ativado' : 'desativado'}!`
                    );
                    await loadProjetos();
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

        // ✅ CORREÇÃO: Reset completo do formulário
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

        // ✅ CORREÇÃO: Limpar serviços selecionados
        setSelectedServicos([]);

        // ✅ CORREÇÃO: Limpar erros
        setErrors({});

        console.log('Modal fechado e state limpo');
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

    const getClienteNome = (idCliente) => {
        const cliente = clientes.find(c => c.idCliente == idCliente);
        return cliente ? cliente.nome : 'N/A';
    };

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

    // Função para calcular orçamento automático
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
        // Recalcular orçamento quando serviços mudam
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
                                                <td>{getClienteNome(projeto.idCliente)}</td>
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
                                                <option value="">Seleciona o cliente</option>
                                                {clientes.map(cliente => (
                                                    <option key={cliente.idCliente} value={cliente.idCliente}>
                                                        {cliente.nome} - {cliente.email}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idCliente && <div className="invalid-feedback">{errors.idCliente}</div>}
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
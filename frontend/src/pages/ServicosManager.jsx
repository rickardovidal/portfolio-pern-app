// ServicosManager.jsx - VERSÃO COMPLETAMENTE CORRIGIDA

import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import NotificationService from '../services/NotificationService';

const ServicosManager = ({ onStatsUpdate }) => {
    const [activeTab, setActiveTab] = useState('servicos');
    const [servicos, setServicos] = useState([]);
    const [tiposServico, setTiposServico] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showTipoModal, setShowTipoModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTipo, setFilterTipo] = useState('');

    const [servicoFormData, setServicoFormData] = useState({
        designacao_servico: '',
        descricao_Servico: '',
        preco_base_servico: '',
        custo_servico: '',
        horas_estimadas: '',
        ativo: true,
        idTipo_Servico: ''
    });

    const [tipoFormData, setTipoFormData] = useState({
        designacao: '',
        descricao: '',
        ativo: true
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadServicos();
        loadTiposServico();
    }, []);

    // ✅ CORRIGIDO - Carregamento simples com toast
    const loadServicos = async () => {
        try {
            setLoading(true);
            const response = await api.get('/servicos');
            if (response.data.success) {
                setServicos(response.data.data || []);
                NotificationService.successToast('Serviços carregados!');
            }
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            NotificationService.errorToast('Erro ao carregar serviços');
        } finally {
            setLoading(false);
        }
    };

    // ✅ CORRIGIDO - Carregamento simples com toast
    const loadTiposServico = async () => {
        try {
            const response = await api.get('/tipos-servicos');
            if (response.data.success) {
                setTiposServico(response.data.data || []);
                NotificationService.successToast('Tipos carregados!');
            }
        } catch (error) {
            console.error('Erro ao carregar tipos de serviço:', error);
            NotificationService.errorToast('Erro ao carregar tipos');
        }
    };

    const getTipoServicoNome = (idTipo) => {
        const tipo = tiposServico.find(t => t.idTipo_Servico == idTipo);
        return tipo ? tipo.designacao : 'N/A';
    };

    const getTipoServicoBadgeClass = (idTipo) => {
        const tipo = tiposServico.find(t => t.idTipo_Servico == idTipo);
        if (!tipo) return 'bg-secondary';

        const tipoNome = tipo.designacao.toLowerCase();

        if (tipoNome.includes('design') || tipoNome.includes('gráfico')) {
            return 'bg-danger';
        } else if (tipoNome.includes('desenvolvimento') || tipoNome.includes('web')) {
            return 'bg-primary';
        } else if (tipoNome.includes('multimédia') || tipoNome.includes('video')) {
            return 'bg-warning';
        } else if (tipoNome.includes('consultoria') || tipoNome.includes('análise')) {
            return 'bg-info';
        } else if (tipoNome.includes('marketing') || tipoNome.includes('publicidade')) {
            return 'bg-success';
        } else {
            const colors = ['bg-primary', 'bg-success', 'bg-info', 'bg-warning', 'bg-danger', 'bg-dark'];
            return colors[idTipo % colors.length];
        }
    };

    const getMargemLucro = (preco, custo) => {
        if (!preco || !custo) return 'N/A';
        const margem = ((preco - custo) / preco) * 100;
        return `${margem.toFixed(1)}%`;
    };

    const handleServicoInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setServicoFormData(prev => ({
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

    const handleTipoInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTipoFormData(prev => ({
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

    const validateServicoForm = () => {
        const newErrors = {};

        if (!servicoFormData.designacao_servico.trim()) {
            newErrors.designacao_servico = 'Designação do serviço é obrigatória';
        }

        if (!servicoFormData.idTipo_Servico) {
            newErrors.idTipo_Servico = 'Tipo de serviço é obrigatório';
        }

        if (!servicoFormData.preco_base_servico || servicoFormData.preco_base_servico <= 0) {
            newErrors.preco_base_servico = 'Preço deve ser maior que 0';
        }

        if (servicoFormData.custo_servico && servicoFormData.custo_servico < 0) {
            newErrors.custo_servico = 'Custo não pode ser negativo';
        }

        if (servicoFormData.horas_estimadas && servicoFormData.horas_estimadas <= 0) {
            newErrors.horas_estimadas = 'Horas estimadas deve ser maior que 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateTipoForm = () => {
        const newErrors = {};

        if (!tipoFormData.designacao.trim()) {
            newErrors.designacao = 'Designação do tipo é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ✅ CORRIGIDO - Submissão com loading e feedback adequado
    const handleServicoSubmit = async (e) => {
        e.preventDefault();

        if (!validateServicoForm()) {
            NotificationService.validationError('Preenche todos os campos obrigatórios!');
            return;
        }

        try {
            NotificationService.loading(editingItem ? 'A atualizar serviço...' : 'A criar serviço...');
            
            let response;
            if (editingItem && activeTab === 'servicos') {
                response = await api.put(
                    `/servicos/${editingItem.idServico}`,
                    servicoFormData
                );
            } else {
                response = await api.post('/servicos', servicoFormData);
            }

            if (response.data.success) {
                NotificationService.closeLoading();
                
                if (editingItem) {
                    NotificationService.updateSuccess('Serviço');
                } else {
                    NotificationService.createSuccess('Serviço');
                }
                
                handleCloseModal();
                await loadServicos();
                if (onStatsUpdate) onStatsUpdate();
            }
        } catch (error) {
            console.error('Erro ao guardar serviço:', error);
            NotificationService.closeLoading();
            
            if (error.response?.data?.message) {
                NotificationService.error('Erro!', error.response.data.message);
            } else {
                NotificationService.errorToast('Erro ao guardar serviço');
            }
        }
    };

    // ✅ CORRIGIDO - Submissão de tipo com loading e feedback adequado
    const handleTipoSubmit = async (e) => {
        e.preventDefault();

        if (!validateTipoForm()) {
            NotificationService.validationError('Preenche todos os campos obrigatórios!');
            return;
        }

        try {
            NotificationService.loading(editingItem ? 'A atualizar tipo...' : 'A criar tipo...');
            
            let response;
            if (editingItem && activeTab === 'tipos') {
                response = await api.put(
                    `/tipos-servicos/${editingItem.idTipo_Servico}`,
                    tipoFormData
                );
            } else {
                response = await api.post('/tipos-servicos', tipoFormData);
            }

            if (response.data.success) {
                NotificationService.closeLoading();
                
                if (editingItem) {
                    NotificationService.updateSuccess('Tipo');
                } else {
                    NotificationService.createSuccess('Tipo');
                }
                
                handleCloseTipoModal();
                await loadTiposServico();
            }
        } catch (error) {
            console.error('Erro ao guardar tipo de serviço:', error);
            NotificationService.closeLoading();
            
            if (error.response?.data?.message) {
                NotificationService.error('Erro!', error.response.data.message);
            } else {
                NotificationService.errorToast('Erro ao guardar tipo');
            }
        }
    };

    const handleEditServico = async (servico) => {
        setEditingItem(servico);

        try { 
            const response = await api.get(`/servicos/${servico.idServico}`);
            if (response.data.success) {
                const servicoCompleto = response.data.data;
                setServicoFormData({
                    designacao_servico: servicoCompleto.designacao_servico || '',
                    descricao_Servico: servicoCompleto.descricao_Servico || '',
                    preco_base_servico: servicoCompleto.preco_base_servico || '',
                    custo_servico: servicoCompleto.custo_servico || '',
                    horas_estimadas: servicoCompleto.horas_estimadas || '',
                    idTipo_Servico: servicoCompleto.idTipo_Servico || '',
                    ativo: servicoCompleto.ativo !== false
                });
            }
        } catch (error) {
            console.error('Erro ao carregar detalhes do serviço:', error);
            setServicoFormData({
                designacao_servico: servico.designacao_servico || '',
                descricao_Servico: servico.descricao_Servico || '',
                preco_base_servico: servico.preco_base_servico || '',
                custo_servico: servico.custo_servico || '',
                horas_estimadas: servico.horas_estimadas || '',
                idTipo_Servico: servico.idTipo_Servico || '',
                ativo: servico.ativo !== false
            });
        }

        setErrors({});
        setShowModal(true);
    };

    const handleEditTipo = (tipo) => {
        setEditingItem(tipo);
        setTipoFormData({
            designacao: tipo.designacao || '',
            descricao: tipo.descricao || '',
            ativo: tipo.ativo !== false
        });
        setErrors({});
        setShowTipoModal(true);
    };

    // ✅ CORRIGIDO - Eliminação com confirmação SweetAlert2
    const handleDeleteServico = async (servico) => {
        const result = await NotificationService.confirmDelete(`o serviço "${servico.designacao_servico}"`);
        
        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/servicos/${servico.idServico}`);
                if (response.data.success) {
                    NotificationService.deleteSuccess('Serviço');
                    await loadServicos();
                    if (onStatsUpdate) onStatsUpdate();
                }
            } catch (error) {
                console.error('Erro ao eliminar serviço:', error);
                if (error.response?.data?.message) {
                    NotificationService.error('Erro!', error.response.data.message);
                } else {
                    NotificationService.error('Erro!', 'Erro ao eliminar serviço. Pode estar associado a projetos.');
                }
            }
        }
    };

    // ✅ CORRIGIDO - Eliminação de tipo com confirmação SweetAlert2
    const handleDeleteTipo = async (tipo) => {
        const result = await NotificationService.confirmDelete(`o tipo "${tipo.designacao}"`);
        
        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/tipos-servicos/${tipo.idTipo_Servico}`);
                if (response.data.success) {
                    NotificationService.deleteSuccess('Tipo');
                    await loadTiposServico();
                }
            } catch (error) {
                console.error('Erro ao eliminar tipo de serviço:', error);
                if (error.response?.data?.message) {
                    NotificationService.error('Erro!', error.response.data.message);
                } else {
                    NotificationService.error('Erro!', 'Erro ao eliminar tipo. Pode ter serviços associados.');
                }
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        setServicoFormData({
            designacao_servico: '',
            descricao_Servico: '',
            preco_base_servico: '',
            custo_servico: '',
            horas_estimadas: '',
            ativo: true,
            idTipo_Servico: ''
        });
        setErrors({});
    };

    const handleCloseTipoModal = () => {
        setShowTipoModal(false);
        setEditingItem(null);
        setTipoFormData({
            designacao: '',
            descricao: '',
            ativo: true
        });
        setErrors({});
    };

    const filteredServicos = servicos.filter(servico => {
        const matchesSearch = servico.designacao_servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (servico.descricao_Servico && servico.descricao_Servico.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTipo = !filterTipo || servico.idTipo_Servico == filterTipo;

        return matchesSearch && matchesTipo;
    });

    const filteredTipos = tiposServico.filter(tipo =>
        tipo.designacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tipo.descricao && tipo.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Gestão de Serviços</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={() => activeTab === 'servicos' ? setShowModal(true) : setShowTipoModal(true)}
                    >
                        <i className={`bi ${activeTab === 'servicos' ? 'bi-plus-circle' : 'bi-tag'} me-2`}></i>
                        {activeTab === 'servicos' ? 'Adicionar Serviço' : 'Adicionar Tipo'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'servicos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('servicos')}
                    >
                        <i className="bi bi-gear me-2"></i>
                        Serviços ({servicos.length})
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link ${activeTab === 'tipos' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tipos')}
                    >
                        <i className="bi bi-tags me-2"></i>
                        Tipos de Serviço ({tiposServico.length})
                    </button>
                </li>
            </ul>

            {/* Filtros */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="bi bi-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder={`Pesquisar ${activeTab === 'servicos' ? 'serviços' : 'tipos'}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                {activeTab === 'servicos' && (
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={filterTipo}
                            onChange={(e) => setFilterTipo(e.target.value)}
                        >
                            <option value="">Todos os tipos</option>
                            {tiposServico.map(tipo => (
                                <option key={tipo.idTipo_Servico} value={tipo.idTipo_Servico}>
                                    {tipo.designacao}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <div className="col-md-3">
                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={() => {
                            loadServicos();
                            loadTiposServico();
                        }}
                        disabled={loading}
                    >
                        {loading ? 'A atualizar...' : 'Atualizar'}
                    </button>
                </div>
            </div>

            {/* Conteúdo das Tabs */}
            {loading ? (
                <div className="text-center p-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">A carregar...</span>
                    </div>
                </div>
            ) : (
                <>
                    {/* Tab Serviços */}
                    {activeTab === 'servicos' && (
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">
                                    Lista de Serviços
                                    <span className="badge bg-primary ms-2">{filteredServicos.length}</span>
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                {filteredServicos.length === 0 ? (
                                    <div className="text-center p-4">
                                        <i className="bi bi-gear-wide fa-3x text-muted mb-3"></i>
                                        <p className="text-muted">
                                            {searchTerm || filterTipo ? 'Nenhum serviço encontrado com os filtros aplicados.' : 'Ainda não tens serviços registados.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Serviço</th>
                                                    <th>Tipo</th>
                                                    <th>Preço</th>
                                                    <th>Custo</th>
                                                    <th>Margem</th>
                                                    <th>Horas Est.</th>
                                                    <th>Estado</th>
                                                    <th className="text-center">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredServicos.map(servico => (
                                                    <tr key={servico.idServico}>
                                                        <td>
                                                            <div>
                                                                <strong>{servico.designacao_servico}</strong>
                                                                {servico.descricao_Servico && (
                                                                    <small className="d-block text-muted">
                                                                        {servico.descricao_Servico.substring(0, 100)}
                                                                        {servico.descricao_Servico.length > 100 ? '...' : ''}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${getTipoServicoBadgeClass(servico.idTipo_Servico)}`}>
                                                                {getTipoServicoNome(servico.idTipo_Servico)}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <strong className="text-success">
                                                                €{parseFloat(servico.preco_base_servico || 0).toFixed(2)}
                                                            </strong>
                                                        </td>
                                                        <td>
                                                            {servico.custo_servico ? (
                                                                <span className="text-danger">
                                                                    €{parseFloat(servico.custo_servico).toFixed(2)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted">-</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <small className="text-info">
                                                                {getMargemLucro(servico.preco_base_servico, servico.custo_servico)}
                                                            </small>
                                                        </td>
                                                        <td>
                                                            {servico.horas_estimadas ?
                                                                `${servico.horas_estimadas}h` :
                                                                <span className="text-muted">-</span>
                                                            }
                                                        </td>
                                                        <td>
                                                            <span className={`badge ${servico.ativo ? 'bg-success' : 'bg-danger'}`}>
                                                                {servico.ativo ? 'Ativo' : 'Inativo'}
                                                            </span>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="btn-group" role="group">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEditServico(servico)}
                                                                    title="Editar serviço"
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDeleteServico(servico)}
                                                                    title="Eliminar serviço"
                                                                >
                                                                    <i className="bi bi-trash"></i>
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

                    {/* Tab Tipos de Serviço */}
                    {activeTab === 'tipos' && (
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">
                                    Lista de Tipos de Serviço
                                    <span className="badge bg-primary ms-2">{filteredTipos.length}</span>
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                {filteredTipos.length === 0 ? (
                                    <div className="text-center p-4">
                                        <i className="bi bi-tags fa-3x text-muted mb-3"></i>
                                        <p className="text-muted">
                                            {searchTerm ? 'Nenhum tipo encontrado com os filtros aplicados.' : 'Ainda não tens tipos de serviço registados.'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Tipo de Serviço</th>
                                                    <th>Descrição</th>
                                                    <th>Criado em</th>
                                                    <th className="text-center">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredTipos.map(tipo => (
                                                    <tr key={tipo.idTipo_Servico}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <span className={`badge ${getTipoServicoBadgeClass(tipo.idTipo_Servico)} me-2`}>
                                                                    <i className="bi bi-tag"></i>
                                                                </span>
                                                                <strong>{tipo.designacao}</strong>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {tipo.descricao || <span className="text-muted">-</span>}
                                                        </td>
                                                        <td>
                                                            <small className="text-muted">
                                                                {new Date(tipo.createdAt).toLocaleDateString('pt-PT')}
                                                            </small>
                                                        </td>
                                                        <td className="text-center">
                                                            <div className="btn-group" role="group">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEditTipo(tipo)}
                                                                    title="Editar tipo"
                                                                >
                                                                    <i className="bi bi-pencil"></i>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => handleDeleteTipo(tipo)}
                                                                    title="Eliminar tipo"
                                                                >
                                                                    <i className="bi bi-trash"></i>
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
                </>
            )}

            {/* Modal para Adicionar/Editar Serviço */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingItem ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>
                            <form onSubmit={handleServicoSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label htmlFor="designacao_servico" className="form-label">
                                                Designação do Serviço <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.designacao_servico ? 'is-invalid' : ''}`}
                                                id="designacao_servico"
                                                name="designacao_servico"
                                                value={servicoFormData.designacao_servico}
                                                onChange={handleServicoInputChange}
                                                placeholder="Nome do serviço"
                                            />
                                            {errors.designacao_servico && <div className="invalid-feedback">{errors.designacao_servico}</div>}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="idTipo_Servico" className="form-label">
                                                Tipo <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.idTipo_Servico ? 'is-invalid' : ''}`}
                                                id="idTipo_Servico"
                                                name="idTipo_Servico"
                                                value={servicoFormData.idTipo_Servico}
                                                onChange={handleServicoInputChange}
                                            >
                                                <option value="">Seleciona o tipo</option>
                                                {tiposServico.filter(t => t.ativo !== false).map(tipo => (
                                                    <option key={tipo.idTipo_Servico} value={tipo.idTipo_Servico}>
                                                        {tipo.designacao}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idTipo_Servico && <div className="invalid-feedback">{errors.idTipo_Servico}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="descricao_Servico" className="form-label">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            id="descricao_Servico"
                                            name="descricao_Servico"
                                            rows="3"
                                            value={servicoFormData.descricao_Servico}
                                            onChange={handleServicoInputChange}
                                            placeholder="Descrição detalhada do serviço"
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="preco_base_servico" className="form-label">
                                                Preço (€) <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className={`form-control ${errors.preco_base_servico ? 'is-invalid' : ''}`}
                                                id="preco_base_servico"
                                                name="preco_base_servico"
                                                value={servicoFormData.preco_base_servico}
                                                onChange={handleServicoInputChange}
                                                placeholder="0.00"
                                            />
                                            {errors.preco_base_servico && <div className="invalid-feedback">{errors.preco_base_servico}</div>}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="custo_servico" className="form-label">Custo (€)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className={`form-control ${errors.custo_servico ? 'is-invalid' : ''}`}
                                                id="custo_servico"
                                                name="custo_servico"
                                                value={servicoFormData.custo_servico}
                                                onChange={handleServicoInputChange}
                                                placeholder="0.00"
                                            />
                                            {errors.custo_servico && <div className="invalid-feedback">{errors.custo_servico}</div>}
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="horas_estimadas" className="form-label">Horas Estimadas</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                className={`form-control ${errors.horas_estimadas ? 'is-invalid' : ''}`}
                                                id="horas_estimadas"
                                                name="horas_estimadas"
                                                value={servicoFormData.horas_estimadas}
                                                onChange={handleServicoInputChange}
                                                placeholder="0.0"
                                            />
                                            {errors.horas_estimadas && <div className="invalid-feedback">{errors.horas_estimadas}</div>}
                                        </div>
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
                                        {editingItem ? 'Atualizar Serviço' : 'Criar Serviço'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para Adicionar/Editar Tipo de Serviço */}
            {showTipoModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingItem ? 'Editar Tipo de Serviço' : 'Adicionar Novo Tipo de Serviço'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseTipoModal}
                                ></button>
                            </div>
                            <form onSubmit={handleTipoSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="designacao" className="form-label">
                                            Designação <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.designacao ? 'is-invalid' : ''}`}
                                            id="designacao"
                                            name="designacao"
                                            value={tipoFormData.designacao}
                                            onChange={handleTipoInputChange}
                                            placeholder="Nome do tipo de serviço"
                                        />
                                        {errors.designacao && <div className="invalid-feedback">{errors.designacao}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="descricao" className="form-label">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            id="descricao"
                                            name="descricao"
                                            rows="3"
                                            value={tipoFormData.descricao}
                                            onChange={handleTipoInputChange}
                                            placeholder="Descrição do tipo de serviço"
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseTipoModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingItem ? 'Atualizar Tipo' : 'Criar Tipo'}
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

export default ServicosManager;
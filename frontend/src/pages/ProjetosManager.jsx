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
    const [maoDeObra, setMaoDeObra] = useState('');
    const [errors, setErrors] = useState({});

    const IVA_TAXA = 0.23;

    // Orçamento sugerido: serviços selecionados + mão de obra, com IVA a 23%
    const calcularOrcamento = (servicoIds, maoDeObraValor) => {
        const subtotalServicos = servicoIds.reduce((total, id) => {
            const servico = servicos.find(s => s.idServico === id);
            return total + parseFloat(servico?.preco_base_servico || 0);
        }, 0);
        const valorMaoDeObra = parseFloat(maoDeObraValor) || 0;
        const subtotal = subtotalServicos + valorMaoDeObra;
        const iva = subtotal * IVA_TAXA;
        return { subtotalServicos, maoDeObra: valorMaoDeObra, iva, total: subtotal + iva };
    };

    // ✅ CORRIGIDO: Função melhorada para obter nome do cliente
    const getClienteNome = (projeto) => {
        console.log('🔍 [FRONTEND DEBUG] getClienteNome chamada para projeto:', projeto.nomeProjeto);
        console.log('🔍 [FRONTEND DEBUG] projeto.cliente:', projeto.cliente);
        
        // ✅ PRIORIDADE 1: Cliente vem do backend (include)
        if (projeto && projeto.cliente && projeto.cliente.nome) {
            console.log('✅ [FRONTEND DEBUG] Cliente encontrado via include:', projeto.cliente.nome);
            return projeto.cliente.nome;
        }
        
        // ✅ PRIORIDADE 2: Procurar na lista local de clientes
        if (projeto && projeto.idCliente && clientes && clientes.length > 0) {
            const clienteLocal = clientes.find(c => c.idCliente === projeto.idCliente);
            if (clienteLocal && clienteLocal.nome) {
                console.log('✅ [FRONTEND DEBUG] Cliente encontrado na lista local:', clienteLocal.nome);
                return clienteLocal.nome;
            }
        }
        
        // ✅ PRIORIDADE 3: Mostrar ID se não encontrar o nome
        if (projeto && projeto.idCliente) {
            console.log('⚠️ [FRONTEND DEBUG] Cliente não encontrado, mostrando ID:', projeto.idCliente);
            return `Cliente ID: ${projeto.idCliente}`;
        }
        
        console.log('❌ [FRONTEND DEBUG] Nenhum cliente encontrado');
        return 'Sem Cliente';
    };

    const initData = async () => {
        try {
            setLoading(true);
            console.log('🔍 [FRONTEND DEBUG] Iniciando carregamento de dados...');

            // ✅ CORRIGIDO: Carregar clientes primeiro (sem loading notification)
            try {
                const clientesResponse = await api.get('/clientes');
                console.log('🔍 [FRONTEND DEBUG] Resposta clientes:', clientesResponse.data);
                
                if (clientesResponse.data.success && clientesResponse.data.data) {
                    setClientes(clientesResponse.data.data);
                    console.log('✅ [FRONTEND DEBUG] Clientes carregados:', clientesResponse.data.data.length);
                } else {
                    console.error('❌ [FRONTEND DEBUG] Erro na resposta de clientes:', clientesResponse.data);
                    setClientes([]);
                }
            } catch (error) {
                console.error('❌ [FRONTEND DEBUG] Erro ao carregar clientes:', error);
                setClientes([]);
            }

            // Carregar estados de projeto
            try {
                const estadosResponse = await api.get('/estados-projeto');
                if (estadosResponse.data.success && estadosResponse.data.data) {
                    setEstadosProjeto(estadosResponse.data.data);
                    console.log('✅ [FRONTEND DEBUG] Estados carregados:', estadosResponse.data.data.length);
                } else {
                    setEstadosProjeto([]);
                }
            } catch (error) {
                console.error('❌ [FRONTEND DEBUG] Erro ao carregar estados:', error);
                setEstadosProjeto([]);
            }

            // Carregar serviços
            try {
                const servicosResponse = await api.get('/servicos');
                if (servicosResponse.data.success && servicosResponse.data.data) {
                    setServicos(servicosResponse.data.data);
                    console.log('✅ [FRONTEND DEBUG] Serviços carregados:', servicosResponse.data.data.length);
                } else {
                    setServicos([]);
                }
            } catch (error) {
                console.error('❌ [FRONTEND DEBUG] Erro ao carregar serviços:', error);
                setServicos([]);
            }

            // ✅ CORRIGIDO: Carregar projetos por último
            try {
                const projetosResponse = await api.get('/projetos');
                console.log('🔍 [FRONTEND DEBUG] Resposta projetos:', projetosResponse.data);
                
                if (projetosResponse.data.success && projetosResponse.data.data) {
                    setProjetos(projetosResponse.data.data);
                    console.log('✅ [FRONTEND DEBUG] Projetos carregados:', projetosResponse.data.data.length);
                    
                    // ✅ DEBUG: Verificar estrutura dos projetos
                    projetosResponse.data.data.forEach((projeto, index) => {
                        console.log(`🔍 [FRONTEND DEBUG] Projeto ${index + 1}:`, {
                            nome: projeto.nomeProjeto,
                            idCliente: projeto.idCliente,
                            temCliente: !!projeto.cliente,
                            nomeCliente: projeto.cliente?.nome || 'NULL'
                        });
                    });
                } else {
                    console.error('❌ [FRONTEND DEBUG] Erro na resposta de projetos:', projetosResponse.data);
                    setProjetos([]);
                }
            } catch (error) {
                console.error('❌ [FRONTEND DEBUG] Erro ao carregar projetos:', error);
                setProjetos([]);
            }

        } catch (error) {
            console.error('❌ [FRONTEND DEBUG] Erro geral:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        initData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleServicoChange = (servicoId) => {
        const atualizados = selectedServicos.includes(servicoId)
            ? selectedServicos.filter(id => id !== servicoId)
            : [...selectedServicos, servicoId];
        setSelectedServicos(atualizados);

        const { total } = calcularOrcamento(atualizados, maoDeObra);
        setFormData(prev => ({ ...prev, orcamentoTotal: total > 0 ? total.toFixed(2) : '' }));
    };

    const handleMaoDeObraChange = (e) => {
        const valor = e.target.value;
        setMaoDeObra(valor);

        const { total } = calcularOrcamento(selectedServicos, valor);
        setFormData(prev => ({ ...prev, orcamentoTotal: total > 0 ? total.toFixed(2) : '' }));
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
        setMaoDeObra('');
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nomeProjeto.trim()) {
            NotificationService.error('Erro!', 'Nome do projeto é obrigatório');
            return;
        }

        try {
            const projetoData = {
                ...formData,
                servicos: selectedServicos
            };

            let response;
            if (editingProject) {
                response = await api.put(`/projetos/${editingProject.idProjeto}`, projetoData);
            } else {
                response = await api.post('/projetos', projetoData);
            }

            if (response.data.success) {
                if (editingProject) {
                    NotificationService.success('Sucesso!', 'Projeto atualizado com sucesso');
                } else {
                    NotificationService.success('Sucesso!', 'Projeto criado com sucesso');
                }

                handleCloseModal();
                await initData();
                if (onStatsUpdate) onStatsUpdate();
            }
        } catch (error) {
            console.error('Erro ao guardar projeto:', error);
            NotificationService.error('Erro!', 'Erro ao guardar projeto');
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
        // A mão de obra não é guardada em separado (apenas o total), por isso começa vazia na edição;
        // o orçamento só é recalculado se os serviços ou a mão de obra forem alterados
        setMaoDeObra('');

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
        
        try {
            const response = await api.put(`/projetos/${projeto.idProjeto}`, {
                ...projeto,
                ativo: novoStatus
            });

            if (response.data.success) {
                NotificationService.success('Sucesso!', `Projeto ${novoStatus ? 'ativado' : 'desativado'} com sucesso`);
                await initData();
                if (onStatsUpdate) onStatsUpdate();
            }
        } catch (error) {
            console.error('Erro ao alterar status:', error);
            NotificationService.error('Erro!', 'Erro ao alterar status do projeto');
        }
    };

    // Filtrar projetos
    const filteredProjetos = projetos.filter(projeto => {
        const matchSearch = projeto.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           getClienteNome(projeto).toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchStatus = filterStatus === '' || 
                           (filterStatus === 'ativo' && projeto.ativo) ||
                           (filterStatus === 'inativo' && !projeto.ativo);
        
        const matchCliente = filterCliente === '' || projeto.idCliente == filterCliente;
        
        const matchEstado = filterEstado === '' || projeto.idEstado_Projeto == filterEstado;
        
        return matchSearch && matchStatus && matchCliente && matchEstado;
    });

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Gestão de Projetos</h2>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Adicionar Projeto
                </button>
            </div>

            {/* Filtros */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Pesquisar por nome ou cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-md-2">
                    <select
                        className="form-select"
                        value={filterCliente}
                        onChange={(e) => setFilterCliente(e.target.value)}
                    >
                        <option value="">Todos os Clientes</option>
                        {/* ✅ CORRIGIDO: Verificar se clientes existe e tem length */}
                        {clientes && clientes.length > 0 && clientes.map(cliente => (
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
                                    {searchTerm || filterCliente || filterEstado || filterStatus ? 
                                        'Nenhum projeto encontrado com os filtros aplicados.' : 
                                        'Ainda não tem projetos registados.'}
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
                                            <th>Data Prevista Fim</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjetos.map((projeto) => (
                                            <tr key={projeto.idProjeto}>
                                                <td>
                                                    <strong>{projeto.nomeProjeto}</strong>
                                                    {projeto.descricaoProjeto && (
                                                        <small className="d-block text-muted">
                                                            {projeto.descricaoProjeto.substring(0, 100)}...
                                                        </small>
                                                    )}
                                                </td>
                                                <td>
                                                    {/* ✅ CORRIGIDO: Usar função melhorada */}
                                                    <span className="badge bg-info">
                                                        {getClienteNome(projeto)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-secondary">
                                                        {projeto.estado?.designacaoEstado_Projeto || 'Sem Estado'}
                                                    </span>
                                                </td>
                                                <td>€{parseFloat(projeto.orcamentoTotal || 0).toFixed(2)}</td>
                                                <td>
                                                    {projeto.dataInicio ? 
                                                        new Date(projeto.dataInicio).toLocaleDateString('pt-PT') : 
                                                        'Não definida'}
                                                </td>
                                                <td>
                                                    {projeto.dataPrevista_Fim ? 
                                                        new Date(projeto.dataPrevista_Fim).toLocaleDateString('pt-PT') : 
                                                        'Não definida'}
                                                </td>
                                                <td>
                                                    <span className={`badge ${projeto.ativo ? 'bg-success' : 'bg-danger'}`}>
                                                        {projeto.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() => handleEdit(projeto)}
                                                            title="Editar"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            className={`btn btn-outline-${projeto.ativo ? 'warning' : 'success'} btn-sm`}
                                                            onClick={() => handleToggleStatus(projeto)}
                                                            title={projeto.ativo ? 'Desativar' : 'Ativar'}
                                                        >
                                                            <i className={`bi bi-${projeto.ativo ? 'pause' : 'play'}`}></i>
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

            {/* Modal de Criação/Edição */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingProject ? 'Editar Projeto' : 'Criar Projeto'}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="nomeProjeto" className="form-label">Nome do Projeto *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="nomeProjeto"
                                                    name="nomeProjeto"
                                                    value={formData.nomeProjeto}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="idCliente" className="form-label">Cliente</label>
                                                <select
                                                    className="form-select"
                                                    id="idCliente"
                                                    name="idCliente"
                                                    value={formData.idCliente}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Selecionar Cliente</option>
                                                    {clientes.map(cliente => (
                                                        <option key={cliente.idCliente} value={cliente.idCliente}>
                                                            {cliente.nome}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
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
                                        <div className="col-md-4">
                                            <div className="mb-3">
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
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="dataPrevista_Fim" className="form-label">Data Prevista Fim</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    id="dataPrevista_Fim"
                                                    name="dataPrevista_Fim"
                                                    value={formData.dataPrevista_Fim}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="orcamentoTotal" className="form-label">Orçamento Total</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="form-control"
                                                    id="orcamentoTotal"
                                                    name="orcamentoTotal"
                                                    value={formData.orcamentoTotal}
                                                    onChange={handleInputChange}
                                                />
                                                <small className="text-muted">
                                                    Preenchido automaticamente (serviços + mão de obra + IVA 23%). Podes ajustar.
                                                </small>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="idEstado_Projeto" className="form-label">Estado</label>
                                                <select
                                                    className="form-select"
                                                    id="idEstado_Projeto"
                                                    name="idEstado_Projeto"
                                                    value={formData.idEstado_Projeto}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="">Selecionar Estado</option>
                                                    {estadosProjeto.map(estado => (
                                                        <option key={estado.idEstado_Projeto} value={estado.idEstado_Projeto}>
                                                            {estado.designacaoEstado_Projeto}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3 d-flex align-items-center">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input me-2"
                                                    id="ativo"
                                                    name="ativo"
                                                    checked={formData.ativo}
                                                    onChange={handleInputChange}
                                                />
                                                <label className="form-check-label" htmlFor="ativo">Projeto Ativo</label>
                                            </div>
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

                                    {servicos.length > 0 && (
                                        <div className="mb-3">
                                            <label className="form-label">Serviços Associados</label>
                                            <div className="row">
                                                {servicos.map(servico => (
                                                    <div key={servico.idServico} className="col-md-6">
                                                        <div className="form-check">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id={`servico-${servico.idServico}`}
                                                                checked={selectedServicos.includes(servico.idServico)}
                                                                onChange={() => handleServicoChange(servico.idServico)}
                                                            />
                                                            <label className="form-check-label" htmlFor={`servico-${servico.idServico}`}>
                                                                {servico.designacao_servico} - €{parseFloat(servico.preco_base_servico || 0).toFixed(2)}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="row mt-3 align-items-start">
                                                <div className="col-md-5">
                                                    <label htmlFor="maoDeObra" className="form-label">Mão de Obra (€)</label>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        className="form-control"
                                                        id="maoDeObra"
                                                        value={maoDeObra}
                                                        onChange={handleMaoDeObraChange}
                                                        placeholder="0.00"
                                                    />
                                                    <small className="text-muted">
                                                        Somada aos serviços antes do IVA; entra apenas no total.
                                                    </small>
                                                </div>
                                                <div className="col-md-7">
                                                    {(() => {
                                                        const resumo = calcularOrcamento(selectedServicos, maoDeObra);
                                                        if (resumo.total <= 0) return null;
                                                        return (
                                                            <div className="border rounded p-2 bg-light small mt-md-0 mt-2">
                                                                <div className="d-flex justify-content-between">
                                                                    <span>Serviços ({selectedServicos.length}):</span>
                                                                    <span>€{resumo.subtotalServicos.toFixed(2)}</span>
                                                                </div>
                                                                <div className="d-flex justify-content-between">
                                                                    <span>Mão de obra:</span>
                                                                    <span>€{resumo.maoDeObra.toFixed(2)}</span>
                                                                </div>
                                                                <div className="d-flex justify-content-between">
                                                                    <span>IVA (23%):</span>
                                                                    <span>€{resumo.iva.toFixed(2)}</span>
                                                                </div>
                                                                <div className="d-flex justify-content-between fw-bold border-top mt-1 pt-1">
                                                                    <span>Total c/ IVA:</span>
                                                                    <span>€{resumo.total.toFixed(2)}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingProject ? 'Atualizar' : 'Criar'} Projeto
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
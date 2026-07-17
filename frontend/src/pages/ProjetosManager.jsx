import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import NotificationService from '../services/NotificationService';
import { tabelaReferenciaPrecos, fontesPesquisa, DATA_PESQUISA, CUSTO_HORA_PADRAO } from '../data/tabelaReferenciaPrecos';

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

    const formDataInicial = {
        nomeProjeto: '',
        descricaoProjeto: '',
        dataInicio: '',
        dataPrevista_Fim: '',
        dataFim: '',
        orcamentoTotal: '',
        horasEstimadas: '',
        custoHora: String(CUSTO_HORA_PADRAO),
        horasExtra: '',
        notas: '',
        idCliente: '',
        idEstado_Projeto: '',
        ativo: true
    };
    const [formData, setFormData] = useState(formDataInicial);

    const [selectedServicos, setSelectedServicos] = useState([]);
    const [showTabelaPrecos, setShowTabelaPrecos] = useState(false);
    const [errors, setErrors] = useState({});

    const IVA_TAXA = 0.23;

    // Orçamento por pacotes: os preços dos serviços já incluem a mão de obra.
    // "Trabalho extra" (horas × taxa) é só para pedidos fora do catálogo.
    const calcularOrcamento = (servicoIds, horasExtra, custoHr) => {
        const subtotalServicos = servicoIds.reduce((total, id) => {
            const servico = servicos.find(s => s.idServico === id);
            return total + parseFloat(servico?.preco_base_servico || 0);
        }, 0);
        const trabalhoExtra = (parseFloat(horasExtra) || 0) * (parseFloat(custoHr) || 0);
        const subtotal = subtotalServicos + trabalhoExtra;
        const iva = subtotal * IVA_TAXA;
        return { subtotalServicos, trabalhoExtra, iva, total: subtotal + iva };
    };

    // Métrica interna: quanto estou realmente a ganhar por hora neste orçamento
    const calcularTaxaEfetiva = () => {
        const horas = parseFloat(formData.horasEstimadas);
        const total = parseFloat(formData.orcamentoTotal);
        if (!horas || horas <= 0 || !total || total <= 0) return null;
        return (total / (1 + IVA_TAXA)) / horas;
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

        // Trabalho extra ou taxa alterados: recalcular o orçamento sugerido
        // (as horas estimadas são métrica interna e não afetam o preço)
        if (name === 'horasExtra' || name === 'custoHora') {
            const horasExtra = name === 'horasExtra' ? value : formData.horasExtra;
            const custoHr = name === 'custoHora' ? value : formData.custoHora;
            const { total } = calcularOrcamento(selectedServicos, horasExtra, custoHr);
            setFormData(prev => ({ ...prev, orcamentoTotal: total > 0 ? total.toFixed(2) : '' }));
        }
    };

    const handleServicoChange = (servicoId) => {
        const atualizados = selectedServicos.includes(servicoId)
            ? selectedServicos.filter(id => id !== servicoId)
            : [...selectedServicos, servicoId];
        setSelectedServicos(atualizados);

        const { total } = calcularOrcamento(atualizados, formData.horasExtra, formData.custoHora);
        setFormData(prev => ({ ...prev, orcamentoTotal: total > 0 ? total.toFixed(2) : '' }));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData(formDataInicial);
        setSelectedServicos([]);
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
            horasEstimadas: projeto.horasEstimadas ?? '',
            custoHora: projeto.custoHora ?? String(CUSTO_HORA_PADRAO),
            horasExtra: '',
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
                <button
                    type="button"
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => setShowTabelaPrecos(true)}
                    title="Tabela de referência de preços/hora"
                >
                    <i className="bi bi-currency-euro me-1"></i>
                    €/h Referência
                </button>
            </div>

            {showTabelaPrecos && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1070 }} onClick={() => setShowTabelaPrecos(false)}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="bi bi-currency-euro me-2"></i>
                                    Tabela de Referência — Preços/Hora (Júnior, Portugal)
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setShowTabelaPrecos(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead>
                                            <tr>
                                                <th>Área</th>
                                                <th className="text-end">Mínimo</th>
                                                <th className="text-end">Máximo</th>
                                                <th>Notas de mercado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tabelaReferenciaPrecos.map(linha => (
                                                <tr key={linha.area}>
                                                    <td className="fw-bold">{linha.area}</td>
                                                    <td className="text-end">€{linha.minimo}/h</td>
                                                    <td className="text-end">€{linha.maximo}/h</td>
                                                    <td className="small text-muted">{linha.notas}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="small text-muted mb-1">
                                    <i className="bi bi-info-circle me-1"></i>
                                    Valores indicativos para freelancers juniores — pesquisa de {DATA_PESQUISA}.
                                    Ajusta conforme a complexidade do projeto e o cliente.
                                </p>
                                <p className="small text-muted mb-0">
                                    Fontes: {fontesPesquisa.map((fonte, i) => (
                                        <span key={fonte.url}>
                                            {i > 0 && ' · '}
                                            <a href={fonte.url} target="_blank" rel="noopener noreferrer">{fonte.nome}</a>
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                                    <h6 className="text-uppercase text-muted small fw-bold mb-3">Informação Básica</h6>
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

                                    <hr className="my-4" />
                                    <h6 className="text-uppercase text-muted small fw-bold mb-3">Prazos e Estado</h6>
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
                                    </div>
                                    <div className="form-check mb-1">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="ativo"
                                            name="ativo"
                                            checked={formData.ativo}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="ativo">Projeto Ativo</label>
                                    </div>

                                    <hr className="my-4" />
                                    <h6 className="text-uppercase text-muted small fw-bold mb-3">Serviços e Orçamento</h6>
                                    {servicos.length > 0 && (
                                        <div className="mb-3">
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
                                        </div>
                                    )}

                                    <div className="row align-items-end">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="horasExtra" className="form-label">Trabalho extra (horas)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    className="form-control"
                                                    id="horasExtra"
                                                    name="horasExtra"
                                                    value={formData.horasExtra}
                                                    onChange={handleInputChange}
                                                    placeholder="0"
                                                />
                                                <small className="text-muted">
                                                    Só para pedidos fora do catálogo, à taxa de €{parseFloat(formData.custoHora || 0).toFixed(2)}/h.
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="orcamentoTotal" className="form-label">Orçamento Total (€)</label>
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
                                                    Automático; podes ajustar.
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            {(() => {
                                                const resumo = calcularOrcamento(selectedServicos, formData.horasExtra, formData.custoHora);
                                                if (resumo.total <= 0) return (
                                                    <p className="text-muted small mb-3">
                                                        Seleciona serviços para calcular o orçamento.
                                                    </p>
                                                );
                                                return (
                                                    <div className="border rounded p-2 bg-light small mb-3">
                                                        <div className="d-flex justify-content-between">
                                                            <span>Serviços ({selectedServicos.length}):</span>
                                                            <span>€{resumo.subtotalServicos.toFixed(2)}</span>
                                                        </div>
                                                        {resumo.trabalhoExtra > 0 && (
                                                            <div className="d-flex justify-content-between">
                                                                <span>Extra ({formData.horasExtra}h):</span>
                                                                <span>€{resumo.trabalhoExtra.toFixed(2)}</span>
                                                            </div>
                                                        )}
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

                                    <hr className="my-4" />
                                    <h6 className="text-uppercase text-muted small fw-bold mb-1">Controlo Interno</h6>
                                    <p className="text-muted small mb-3">
                                        Não afeta o preço — serve para veres se o orçamento compensa o teu tempo.
                                    </p>
                                    <div className="row align-items-end">
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="horasEstimadas" className="form-label">Horas Estimadas (totais)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    className="form-control"
                                                    id="horasEstimadas"
                                                    name="horasEstimadas"
                                                    value={formData.horasEstimadas}
                                                    onChange={handleInputChange}
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label htmlFor="custoHora" className="form-label">Taxa-Alvo (€/h)</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.50"
                                                    className="form-control"
                                                    id="custoHora"
                                                    name="custoHora"
                                                    value={formData.custoHora}
                                                    onChange={handleInputChange}
                                                />
                                                <small>
                                                    <button
                                                        type="button"
                                                        className="btn btn-link btn-sm p-0 text-decoration-none"
                                                        onClick={() => setShowTabelaPrecos(true)}
                                                    >
                                                        Ver tabela de referência
                                                    </button>
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            {(() => {
                                                const taxa = calcularTaxaEfetiva();
                                                if (taxa === null) return (
                                                    <p className="text-muted small mb-3">
                                                        Define horas e orçamento para veres a taxa efetiva.
                                                    </p>
                                                );
                                                const alvo = parseFloat(formData.custoHora) || 0;
                                                const saudavel = taxa >= alvo;
                                                return (
                                                    <div className={`border rounded p-2 small mb-3 ${saudavel ? 'border-success bg-success-subtle' : 'border-danger bg-danger-subtle'}`}>
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <span>Taxa efetiva:</span>
                                                            <strong className={saudavel ? 'text-success' : 'text-danger'}>
                                                                €{taxa.toFixed(2)}/h
                                                            </strong>
                                                        </div>
                                                        <small className={saudavel ? 'text-success' : 'text-danger'}>
                                                            {saudavel
                                                                ? 'Acima da taxa-alvo — orçamento saudável.'
                                                                : 'Abaixo da taxa-alvo — considera subir o preço ou reduzir o âmbito.'}
                                                        </small>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    <hr className="my-4" />
                                    <h6 className="text-uppercase text-muted small fw-bold mb-3">Notas</h6>
                                    <div className="mb-3">
                                        <textarea
                                            className="form-control"
                                            id="notas"
                                            name="notas"
                                            rows="3"
                                            value={formData.notas}
                                            onChange={handleInputChange}
                                            placeholder="Notas internas do projeto (opcional)"
                                        ></textarea>
                                    </div>
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
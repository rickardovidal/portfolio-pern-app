import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import NotificationService from '../services/NotificationService';

const ProjetosManager = ({ onStatsUpdate }) => {
    // 🔥 Estados principais
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
    const [debugInfo, setDebugInfo] = useState(''); // Para debug visual

    // 🚀 CARREGAMENTO INICIAL - VERSÃO ROBUSTA
    useEffect(() => {
        carregarTudoSequencialmente();
    }, []);

    const carregarTudoSequencialmente = async () => {
        try {
            setLoading(true);
            setDebugInfo('Iniciando carregamento...');
            
            // 1. Carregar clientes PRIMEIRO (mais importante)
            setDebugInfo('Carregando clientes...');
            await carregarClientes();
            
            // 2. Carregar estados
            setDebugInfo('Carregando estados...');
            await carregarEstados();
            
            // 3. Carregar serviços
            setDebugInfo('Carregando serviços...');
            await carregarServicos();
            
            // 4. Carregar projetos POR ÚLTIMO (para garantir que clientes já estão disponíveis)
            setDebugInfo('Carregando projetos...');
            await carregarProjetos();
            
            setDebugInfo('Tudo carregado com sucesso!');
            NotificationService.successToast('Dados carregados!');
            
        } catch (error) {
            setDebugInfo(`Erro: ${error.message}`);
            NotificationService.errorToast('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    // 🎯 FUNÇÕES DE CARREGAMENTO INDIVIDUAIS
    const carregarClientes = async () => {
        const response = await api.get('/clientes');
        if (response.data.success && Array.isArray(response.data.data)) {
            setClientes(response.data.data);
            setDebugInfo(`${response.data.data.length} clientes carregados`);
        } else {
            throw new Error('Clientes: resposta inválida');
        }
    };

    const carregarEstados = async () => {
        const response = await api.get('/estados-projeto');
        if (response.data.success && Array.isArray(response.data.data)) {
            setEstadosProjeto(response.data.data);
        } else {
            throw new Error('Estados: resposta inválida');
        }
    };

    const carregarServicos = async () => {
        const response = await api.get('/servicos');
        if (response.data.success && Array.isArray(response.data.data)) {
            setServicos(response.data.data);
        } else {
            throw new Error('Serviços: resposta inválida');
        }
    };

    const carregarProjetos = async () => {
        const response = await api.get('/projetos');
        if (response.data.success && Array.isArray(response.data.data)) {
            setProjetos(response.data.data);
            setDebugInfo(`${response.data.data.length} projetos carregados`);
        } else {
            throw new Error('Projetos: resposta inválida');
        }
    };

    // 🎯 FUNÇÃO PARA OBTER NOME DO CLIENTE - VERSÃO SUPER ROBUSTA
    const getClienteNome = (projeto) => {
        // Verificações de segurança
        if (!projeto) return 'Projeto inválido';
        if (!Array.isArray(clientes) || clientes.length === 0) return 'Carregando...';

        // Estratégia 1: Objeto cliente aninhado do backend
        if (projeto.cliente && 
            typeof projeto.cliente === 'object' && 
            projeto.cliente.nome && 
            projeto.cliente.nome.trim() !== '') {
            return projeto.cliente.nome;
        }

        // Estratégia 2: Procurar na lista de clientes por ID
        if (projeto.idCliente) {
            const clienteEncontrado = clientes.find(cliente => {
                return cliente && 
                       cliente.idCliente && 
                       parseInt(cliente.idCliente) === parseInt(projeto.idCliente);
            });
            
            if (clienteEncontrado && clienteEncontrado.nome && clienteEncontrado.nome.trim() !== '') {
                return clienteEncontrado.nome;
            }
        }

        // Estratégia 3: Informação de debug
        if (projeto.idCliente) {
            return `ID: ${projeto.idCliente} (não encontrado)`;
        }

        return 'N/A';
    };

    // 🎯 FUNÇÃO PARA OBTER NOME DO ESTADO
    const getEstadoNome = (projeto) => {
        if (!projeto || !Array.isArray(estadosProjeto)) return 'N/A';
        
        // Estratégia 1: Objeto estado aninhado
        if (projeto.estado && projeto.estado.designacaoEstado_Projeto) {
            return projeto.estado.designacaoEstado_Projeto;
        }
        
        // Estratégia 2: Procurar na lista
        if (projeto.idEstado_Projeto) {
            const estado = estadosProjeto.find(e => 
                e && parseInt(e.idEstado_Projeto) === parseInt(projeto.idEstado_Projeto)
            );
            if (estado && estado.designacaoEstado_Projeto) {
                return estado.designacaoEstado_Projeto;
            }
        }
        
        return 'N/A';
    };

    // 🔍 FILTROS - VERSÃO MELHORADA
    const filteredProjetos = projetos.filter(projeto => {
        if (!projeto) return false;

        // Filtro de pesquisa
        if (searchTerm) {
            const termo = searchTerm.toLowerCase();
            const nome = projeto.nomeProjeto ? projeto.nomeProjeto.toLowerCase() : '';
            const descricao = projeto.descricaoProjeto ? projeto.descricaoProjeto.toLowerCase() : '';
            const clienteNome = getClienteNome(projeto).toLowerCase();
            
            if (!nome.includes(termo) && 
                !descricao.includes(termo) && 
                !clienteNome.includes(termo)) {
                return false;
            }
        }

        // Filtro de cliente
        if (filterCliente && projeto.idCliente) {
            if (parseInt(projeto.idCliente) !== parseInt(filterCliente)) {
                return false;
            }
        }

        // Filtro de estado
        if (filterEstado && projeto.idEstado_Projeto) {
            if (parseInt(projeto.idEstado_Projeto) !== parseInt(filterEstado)) {
                return false;
            }
        }

        // Filtro de status
        if (filterStatus) {
            if (filterStatus === 'ativo' && !projeto.ativo) return false;
            if (filterStatus === 'inativo' && projeto.ativo) return false;
        }

        return true;
    });

    // 📝 HANDLERS DO FORMULÁRIO
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Limpar erro específico
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
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

    // 💾 SUBMISSÃO DO FORMULÁRIO
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            NotificationService.loading(editingProject ? 'A actualizar projeto...' : 'A criar projeto...');

            const dados = {
                ...formData,
                servicos: selectedServicos
            };

            let response;
            if (editingProject) {
                response = await api.put(`/projetos/${editingProject.idProjeto}`, dados);
            } else {
                response = await api.post('/projetos', dados);
            }

            if (response.data.success) {
                NotificationService.closeLoading();
                NotificationService.successToast(
                    editingProject ? 'Projeto actualizado!' : 'Projeto criado!'
                );
                
                setShowModal(false);
                resetForm();
                await carregarProjetos(); // Recarregar apenas projetos
                
                if (onStatsUpdate) onStatsUpdate();
            } else {
                throw new Error(response.data.message || 'Erro na operação');
            }

        } catch (error) {
            NotificationService.closeLoading();
            
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                NotificationService.errorToast('Verifique os campos obrigatórios');
            } else {
                NotificationService.errorToast(
                    error.response?.data?.message || 'Erro ao salvar projeto'
                );
            }
        } finally {
            setLoading(false);
        }
    };

    // 🔄 OUTRAS FUNÇÕES
    const resetForm = () => {
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
        setEditingProject(null);
        setErrors({});
    };

    const handleEdit = (projeto) => {
        setEditingProject(projeto);
        setFormData({
            nomeProjeto: projeto.nomeProjeto || '',
            descricaoProjeto: projeto.descricaoProjeto || '',
            dataInicio: projeto.dataInicio ? projeto.dataInicio.split('T')[0] : '',
            dataPrevista_Fim: projeto.dataPrevista_Fim ? projeto.dataPrevista_Fim.split('T')[0] : '',
            dataFim: projeto.dataFim ? projeto.dataFim.split('T')[0] : '',
            orcamentoTotal: projeto.orcamentoTotal || '',
            notas: projeto.notas || '',
            idCliente: projeto.idCliente || '',
            idEstado_Projeto: projeto.idEstado_Projeto || '',
            ativo: projeto.ativo !== false
        });
        setSelectedServicos([]); // Seria necessário carregar serviços associados
        setShowModal(true);
    };

    const handleDelete = async (projeto) => {
        if (!window.confirm(`Tem a certeza que deseja desativar o projeto "${projeto.nomeProjeto}"?`)) {
            return;
        }

        try {
            setLoading(true);
            NotificationService.loading('A desativar projeto...');

            const response = await api.patch(`/projetos/${projeto.idProjeto}/cancelar`);

            if (response.data.success) {
                NotificationService.closeLoading();
                NotificationService.successToast('Projeto desativado!');
                await carregarProjetos();
                if (onStatsUpdate) onStatsUpdate();
            } else {
                throw new Error(response.data.message);
            }

        } catch (error) {
            NotificationService.closeLoading();
            NotificationService.errorToast(
                error.response?.data?.message || 'Erro ao desativar projeto'
            );
        } finally {
            setLoading(false);
        }
    };

    // 🎨 RENDERIZAÇÃO
    return (
        <div className="container-fluid">
            {/* Debug Info */}
            {debugInfo && (
                <div className="alert alert-info mb-3">
                    <strong>Debug:</strong> {debugInfo} | 
                    Clientes: {clientes.length} | 
                    Projetos: {projetos.length}
                </div>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    <i className="bi bi-kanban me-2"></i>
                    Gestão de Projetos
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                    disabled={loading}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    Novo Projeto
                </button>
            </div>

            {/* Filtros */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Pesquisar projetos..."
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
                        <option value="">Todos os Clientes ({clientes.length})</option>
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
                    <p className="mt-3">A carregar projetos...</p>
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
                                    {searchTerm || filterCliente || filterEstado || filterStatus 
                                        ? 'Nenhum projeto encontrado com os filtros aplicados.' 
                                        : 'Ainda não tens projetos registados.'}
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
                                            <th>Data Início</th>
                                            <th>Orçamento</th>
                                            <th>Status</th>
                                            <th width="120">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjetos.map(projeto => (
                                            <tr key={projeto.idProjeto}>
                                                <td>
                                                    <div>
                                                        <div className="fw-semibold">{projeto.nomeProjeto}</div>
                                                        {projeto.descricaoProjeto && (
                                                            <small className="text-muted">
                                                                {projeto.descricaoProjeto.length > 50 
                                                                    ? projeto.descricaoProjeto.substring(0, 50) + '...' 
                                                                    : projeto.descricaoProjeto}
                                                            </small>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">
                                                        {getClienteNome(projeto)}
                                                    </span>
                                                </td>
                                                <td>{getEstadoNome(projeto)}</td>
                                                <td>
                                                    {projeto.dataInicio 
                                                        ? new Date(projeto.dataInicio).toLocaleDateString('pt-PT')
                                                        : 'N/A'}
                                                </td>
                                                <td>
                                                    {projeto.orcamentoTotal 
                                                        ? `€${parseFloat(projeto.orcamentoTotal).toFixed(2)}`
                                                        : 'N/A'}
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
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDelete(projeto)}
                                                        title="Desativar"
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

            {/* Modal do Formulário */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
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
                                                    required
                                                />
                                                {errors.nomeProjeto && (
                                                    <div className="invalid-feedback">{errors.nomeProjeto}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="idCliente" className="form-label">
                                                    Cliente <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className={`form-select ${errors.idCliente ? 'is-invalid' : ''}`}
                                                    id="idCliente"
                                                    name="idCliente"
                                                    value={formData.idCliente}
                                                    onChange={handleInputChange}
                                                    required
                                                >
                                                    <option value="">Seleciona um cliente ({clientes.length} disponíveis)</option>
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
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label htmlFor="idEstado_Projeto" className="form-label">
                                                    Estado do Projeto <span className="text-danger">*</span>
                                                </label>
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
                                                {errors.idEstado_Projeto && (
                                                    <div className="invalid-feedback">{errors.idEstado_Projeto}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <div className="form-check mt-4">
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
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Serviços Associados ({servicos.length} disponíveis)</label>
                                        <div className="row">
                                            {servicos.map(servico => (
                                                <div className="col-md-6" key={servico.idServico}>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`servico_${servico.idServico}`}
                                                            checked={selectedServicos.includes(servico.idServico)}
                                                            onChange={() => handleServicoToggle(servico.idServico)}
                                                        />
                                                        <label 
                                                            className="form-check-label" 
                                                            htmlFor={`servico_${servico.idServico}`}
                                                        >
                                                            {servico.designacao_servico}
                                                            {servico.preco_base_servico && (
                                                                <span className="text-muted ms-1">
                                                                    (€{parseFloat(servico.preco_base_servico).toFixed(2)})
                                                                </span>
                                                            )}
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
                                </div>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                A processar...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-lg me-2"></i>
                                                {editingProject ? 'Actualizar' : 'Criar'} Projeto
                                            </>
                                        )}
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
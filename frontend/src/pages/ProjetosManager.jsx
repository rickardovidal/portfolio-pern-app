import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import NotificationService from '../services/NotificationService';

// 🔥🔥🔥 VERSÃO NOVA - TIMESTAMP: 2025-08-11-00:59 🔥🔥🔥

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
    
    // 🔥 TIMESTAMP PARA VERIFICAR SE É A VERSÃO NOVA
    const BUILD_TIME = '2025-08-11 00:59:00';

    useEffect(() => {
        carregarTudoSequencialmente();
    }, []);

    const carregarTudoSequencialmente = async () => {
        try {
            setLoading(true);
            
            // 🔥 CARREGAR CLIENTES PRIMEIRO - SEMPRE!
            console.log('🔥 NOVA VERSÃO: Carregando clientes...');
            await carregarClientes();
            
            console.log('🔥 NOVA VERSÃO: Carregando estados...');
            await carregarEstados();
            
            console.log('🔥 NOVA VERSÃO: Carregando serviços...');
            await carregarServicos();
            
            console.log('🔥 NOVA VERSÃO: Carregando projetos...');
            await carregarProjetos();
            
            console.log('🔥 NOVA VERSÃO: Tudo carregado!');
            NotificationService.successToast('🔥 NOVA VERSÃO: Dados carregados!');
            
        } catch (error) {
            console.error('🔥 ERRO na nova versão:', error);
            NotificationService.errorToast('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const carregarClientes = async () => {
        try {
            const response = await api.get('/clientes');
            console.log('🔥 CLIENTES RESPONSE:', response.data);
            
            if (response.data.success && Array.isArray(response.data.data)) {
                setClientes(response.data.data);
                console.log('🔥 CLIENTES DEFINIDOS:', response.data.data.length, 'clientes');
            } else {
                console.error('🔥 ERRO: Resposta inválida de clientes:', response.data);
                throw new Error('Clientes: resposta inválida');
            }
        } catch (error) {
            console.error('🔥 ERRO ao carregar clientes:', error);
            throw error;
        }
    };

    const carregarEstados = async () => {
        const response = await api.get('/estados-projeto');
        if (response.data.success && Array.isArray(response.data.data)) {
            setEstadosProjeto(response.data.data);
        }
    };

    const carregarServicos = async () => {
        const response = await api.get('/servicos');
        if (response.data.success && Array.isArray(response.data.data)) {
            setServicos(response.data.data);
        }
    };

    const carregarProjetos = async () => {
        try {
            const response = await api.get('/projetos');
            console.log('🔥 PROJETOS RESPONSE:', response.data);
            
            if (response.data.success && Array.isArray(response.data.data)) {
                setProjetos(response.data.data);
                console.log('🔥 PROJETOS DEFINIDOS:', response.data.data.length, 'projetos');
            } else {
                console.error('🔥 ERRO: Resposta inválida de projetos:', response.data);
            }
        } catch (error) {
            console.error('🔥 ERRO ao carregar projetos:', error);
        }
    };
    //////

    // 🔥🔥🔥 FUNÇÃO COMPLETAMENTE NOVA PARA NOME DO CLIENTE 🔥🔥🔥
    const getClienteNome = (projeto) => {
        console.log('🔥 getClienteNome chamada para projeto:', projeto?.nomeProjeto);
        console.log('🔥 Array clientes tem:', clientes.length, 'elementos');
        console.log('🔥 Projeto.idCliente:', projeto?.idCliente);
        console.log('🔥 Projeto.cliente:', projeto?.cliente);

        // Verificações básicas
        if (!projeto) {
            console.log('🔥 RETORNO: Projeto inválido');
            return '🔥 Projeto inválido';
        }

        if (!Array.isArray(clientes)) {
            console.log('🔥 RETORNO: Clientes não é array');
            return '🔥 Clientes não carregados';
        }

        if (clientes.length === 0) {
            console.log('🔥 RETORNO: Array clientes vazio');
            return '🔥 A carregar clientes...';
        }

        // Estratégia 1: Objeto cliente aninhado do backend
        if (projeto.cliente && 
            typeof projeto.cliente === 'object' && 
            projeto.cliente.nome && 
            projeto.cliente.nome.trim() !== '') {
            console.log('🔥 RETORNO: Nome do objeto aninhado:', projeto.cliente.nome);
            return '🔥 ' + projeto.cliente.nome;
        }

        // Estratégia 2: Procurar na lista de clientes
        if (projeto.idCliente) {
            console.log('🔥 Procurando cliente com ID:', projeto.idCliente);
            console.log('🔥 Lista de clientes:', clientes.map(c => ({ id: c.idCliente, nome: c.nome })));
            
            const clienteEncontrado = clientes.find(cliente => {
                const match = cliente && 
                             cliente.idCliente && 
                             parseInt(cliente.idCliente) === parseInt(projeto.idCliente);
                console.log(`🔥 Comparando ${cliente?.idCliente} === ${projeto.idCliente} = ${match}`);
                return match;
            });
            
            if (clienteEncontrado && clienteEncontrado.nome && clienteEncontrado.nome.trim() !== '') {
                console.log('🔥 RETORNO: Cliente encontrado na lista:', clienteEncontrado.nome);
                return '🔥 ' + clienteEncontrado.nome;
            } else {
                console.log('🔥 RETORNO: Cliente não encontrado na lista');
                return `🔥 ID:${projeto.idCliente} (não encontrado)`;
            }
        }

        console.log('🔥 RETORNO: N/A (sem ID)');
        return '🔥 N/A';
    };

    const getEstadoNome = (projeto) => {
        if (!projeto || !Array.isArray(estadosProjeto)) return 'N/A';
        
        if (projeto.estado && projeto.estado.designacaoEstado_Projeto) {
            return projeto.estado.designacaoEstado_Projeto;
        }
        
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

    // Filtros
    const filteredProjetos = projetos.filter(projeto => {
        if (!projeto) return false;

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

        if (filterCliente && projeto.idCliente) {
            if (parseInt(projeto.idCliente) !== parseInt(filterCliente)) {
                return false;
            }
        }

        if (filterEstado && projeto.idEstado_Projeto) {
            if (parseInt(projeto.idEstado_Projeto) !== parseInt(filterEstado)) {
                return false;
            }
        }

        if (filterStatus) {
            if (filterStatus === 'ativo' && !projeto.ativo) return false;
            if (filterStatus === 'inativo' && projeto.ativo) return false;
        }

        return true;
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

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

    return (
        <div className="container-fluid">
            {/* 🔥🔥🔥 HEADER IMPOSSÍVEL DE IGNORAR 🔥🔥🔥 */}
            <div className="alert alert-danger mb-4" style={{ border: '3px solid red', fontSize: '16px' }}>
                <h4>🔥🔥🔥 NOVA VERSÃO CARREGADA - {BUILD_TIME} 🔥🔥🔥</h4>
                <div><strong>📊 STATUS ACTUAL:</strong></div>
                <div>• Clientes carregados: <span className="badge bg-primary">{clientes.length}</span></div>
                <div>• Projetos carregados: <span className="badge bg-success">{projetos.length}</span></div>
                <div>• A carregar: <span className="badge bg-warning">{loading ? 'SIM' : 'NÃO'}</span></div>
                <div><strong>🔍 TESTE:</strong> Se vês este alert, a nova versão está a funcionar!</div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">
                    🔥 Gestão de Projetos (NOVA VERSÃO)
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                    disabled={loading}
                >
                    <i className="bi bi-plus-lg me-2"></i>
                    🔥 Novo Projeto
                </button>
            </div>

            {/* Filtros com indicadores visuais */}
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
                        style={{ border: '2px solid orange' }}
                    >
                        <option value="">🔥 NOVO: Todos os Clientes ({clientes.length})</option>
                        {clientes.map(cliente => (
                            <option key={cliente.idCliente} value={cliente.idCliente}>
                                🔥 {cliente.nome}
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
                    <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
                        <span className="visually-hidden">A carregar...</span>
                    </div>
                    <h4 className="mt-3">🔥 A carregar nova versão...</h4>
                </div>
            ) : (
                <div className="card" style={{ border: '3px solid green' }}>
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">
                            🔥🔥🔥 Lista de Projetos (VERSÃO NOVA CONFIRMADA) 🔥🔥🔥
                            <span className="badge bg-warning text-dark ms-2">{filteredProjetos.length}</span>
                        </h5>
                    </div>
                    <div className="card-body p-0">
                        {filteredProjetos.length === 0 ? (
                            <div className="text-center p-4">
                                <i className="bi bi-folder-x fa-3x text-muted mb-3"></i>
                                <p className="text-muted">
                                    {searchTerm || filterCliente || filterEstado || filterStatus 
                                        ? '🔥 Nenhum projeto encontrado (NOVA VERSÃO)' 
                                        : '🔥 Ainda não tens projetos (NOVA VERSÃO)'}
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-danger">
                                        <tr>
                                            <th>🔥 Projeto</th>
                                            <th style={{ backgroundColor: 'yellow', color: 'black', fontWeight: 'bold' }}>
                                                🔥🔥🔥 CLIENTE (VERSÃO NOVA) 🔥🔥🔥
                                            </th>
                                            <th>🔥 Estado</th>
                                            <th>🔥 Data Início</th>
                                            <th>🔥 Orçamento</th>
                                            <th>🔥 Status</th>
                                            <th width="120">🔥 Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProjetos.map(projeto => (
                                            <tr key={projeto.idProjeto}>
                                                <td>
                                                    <div>
                                                        <div className="fw-semibold">🔥 {projeto.nomeProjeto}</div>
                                                        {projeto.descricaoProjeto && (
                                                            <small className="text-muted">
                                                                {projeto.descricaoProjeto.length > 50 
                                                                    ? projeto.descricaoProjeto.substring(0, 50) + '...' 
                                                                    : projeto.descricaoProjeto}
                                                            </small>
                                                        )}
                                                    </div>
                                                </td>
                                                <td style={{ backgroundColor: 'lightgreen', fontWeight: 'bold' }}>
                                                    <span className="badge bg-danger" style={{ fontSize: '14px', padding: '8px' }}>
                                                        {getClienteNome(projeto)}
                                                    </span>
                                                </td>
                                                <td>🔥 {getEstadoNome(projeto)}</td>
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
                                                        🔥 {projeto.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-primary me-1"
                                                        onClick={() => setShowModal(true)}
                                                        title="🔥 Editar (Nova Versão)"
                                                    >
                                                        🔥 <i className="bi bi-pencil"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        title="🔥 Desativar (Nova Versão)"
                                                    >
                                                        🔥 <i className="bi bi-trash"></i>
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

            {/* Modal simplificado para teste */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(255,0,0,0.8)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ border: '5px solid red' }}>
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">🔥🔥🔥 MODAL DA NOVA VERSÃO FUNCIONANDO! 🔥🔥🔥</h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-success">
                                    <h6>✅ NOVA VERSÃO CONFIRMADA!</h6>
                                    <p><strong>Build:</strong> {BUILD_TIME}</p>
                                    <p><strong>Clientes carregados:</strong> {clientes.length}</p>
                                    <p><strong>Projetos carregados:</strong> {projetos.length}</p>
                                </div>
                                <p>Se vês este modal, a nova versão está definitivamente a funcionar!</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => setShowModal(false)}
                                >
                                    🔥 Fechar Modal Novo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjetosManager;
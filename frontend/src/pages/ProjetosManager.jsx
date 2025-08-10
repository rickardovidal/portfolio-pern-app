import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import NotificationService from '../services/NotificationService';

const ProjetosManager = ({ onStatsUpdate }) => {
    // Estados principais da aplicação
    const [projetos, setProjetos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [estadosProjeto, setEstadosProjeto] = useState([]);
    const [servicos, setServicos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    
    // Estados de filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCliente, setFilterCliente] = useState('');
    const [filterEstado, setFilterEstado] = useState('');

    // Estados do formulário
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
    
    // Estado de diagnóstico para mostrar informações na interface
    const [diagnosticInfo, setDiagnosticInfo] = useState('');

    // Função utilitária para logs que sempre funcionam
    const debugLog = (message, data = null) => {
        // Tenta múltiplas formas de logging
        try {
            console.log(message, data);
        } catch (e) {
            // Se console.log falhar, tenta alert como fallback para debug crítico
            if (message.includes('CRÍTICO')) {
                alert(`DEBUG: ${message}`);
            }
        }
        
        // Actualiza informações de diagnóstico na interface
        setDiagnosticInfo(prev => prev + '\n' + message + (data ? ' - ' + JSON.stringify(data) : ''));
    };

    // Inicialização quando o componente monta
    useEffect(() => {
        debugLog('🚀 CRÍTICO: ProjetosManager inicializando...');
        
        const initData = async () => {
            try {
                debugLog('📋 Iniciando carregamento sequencial de dados...');
                
                // Carrega dados de forma sequencial para evitar conflitos
                await loadClientes();
                await loadEstadosProjeto();
                await loadServicos();
                await loadProjetos();
                
                debugLog('✅ Inicialização completa');
            } catch (error) {
                debugLog('❌ CRÍTICO: Erro na inicialização', error.message);
                NotificationService.errorToast('Erro ao inicializar dados');
            }
        };
        
        initData();
    }, []);

    // Função para carregar clientes com verificações robustas
    const loadClientes = async () => {
        try {
            debugLog('🔄 Iniciando carregamento de clientes...');
            
            // Verifica se o token existe
            const token = localStorage.getItem('adminToken');
            if (!token) {
                debugLog('❌ CRÍTICO: Token não encontrado');
                NotificationService.errorToast('Sessão expirada. Por favor, faz login novamente.');
                return;
            }

            const response = await api.get('/clientes');
            debugLog('📡 Resposta recebida para clientes', {
                status: response?.status,
                success: response?.data?.success,
                dataExists: !!response?.data?.data,
                dataLength: response?.data?.data?.length
            });

            if (response?.data?.success) {
                const clientesData = response.data.data || [];
                debugLog(`✅ ${clientesData.length} clientes processados`);
                
                // Validação dos dados recebidos
                const clientesValidos = clientesData.filter(cliente => 
                    cliente && cliente.idCliente && cliente.nome
                );
                
                if (clientesValidos.length !== clientesData.length) {
                    debugLog('⚠️ Alguns clientes têm dados inválidos', {
                        total: clientesData.length,
                        validos: clientesValidos.length
                    });
                }

                setClientes(clientesValidos);
                debugLog('💾 Estado de clientes atualizado');
                
                if (clientesValidos.length > 0) {
                    NotificationService.successToast(`${clientesValidos.length} clientes carregados!`);
                } else {
                    debugLog('⚠️ Nenhum cliente válido encontrado');
                    NotificationService.errorToast('Nenhum cliente encontrado');
                }
            } else {
                debugLog('❌ API retornou success: false', response?.data);
                NotificationService.errorToast('Erro na resposta do servidor ao carregar clientes');
            }
        } catch (error) {
            debugLog('💥 Erro ao carregar clientes', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            
            NotificationService.errorToast('Erro ao carregar clientes');
            setClientes([]); // Garante array vazio em caso de erro
        }
    };

    // Função para carregar projetos com análise detalhada das associações
    const loadProjetos = async () => {
        try {
            setLoading(true);
            debugLog('🔄 Iniciando carregamento de projetos...');

            const response = await api.get('/projetos');
            debugLog('📡 Resposta recebida para projetos', {
                status: response?.status,
                success: response?.data?.success,
                dataExists: !!response?.data?.data,
                dataLength: response?.data?.data?.length
            });

            if (response?.data?.success) {
                const projetosData = response.data.data || [];
                debugLog(`✅ ${projetosData.length} projetos processados`);

                // Análise detalhada de cada projeto e suas associações
                projetosData.forEach((projeto, index) => {
                    debugLog(`📁 Projeto ${index + 1}: ${projeto.nomeProjeto}`, {
                        idProjeto: projeto.idProjeto,
                        idCliente: projeto.idCliente,
                        idClienteTipo: typeof projeto.idCliente,
                        temAssociacaoCliente: !!projeto.cliente,
                        temAssociacaoClientes: !!projeto.clientes,
                        nomeViaCliente: projeto.cliente?.nome,
                        nomeViaClientes: projeto.clientes?.nome,
                        todasChaves: Object.keys(projeto)
                    });
                });

                setProjetos(projetosData);
                debugLog('💾 Estado de projetos atualizado');
                
            } else {
                debugLog('❌ API retornou success: false para projetos', response?.data);
                NotificationService.errorToast('Erro na resposta do servidor ao carregar projetos');
            }
        } catch (error) {
            debugLog('💥 Erro ao carregar projetos', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            NotificationService.errorToast('Erro ao carregar projetos');
        } finally {
            setLoading(false);
        }
    };

    // Função para carregar estados de projeto
    const loadEstadosProjeto = async () => {
        try {
            debugLog('🔄 Carregando estados de projeto...');
            const response = await api.get('/estados-projeto');
            
            if (response?.data?.success) {
                const estadosData = response.data.data || [];
                setEstadosProjeto(estadosData);
                debugLog(`✅ ${estadosData.length} estados carregados`);
                NotificationService.successToast('Estados carregados!');
            }
        } catch (error) {
            debugLog('❌ Erro ao carregar estados de projeto', error.message);
            NotificationService.errorToast('Erro ao carregar estados');
        }
    };

    // Função para carregar serviços
    const loadServicos = async () => {
        try {
            debugLog('🔄 Carregando serviços...');
            const response = await api.get('/servicos');
            
            if (response?.data?.success) {
                const servicosData = response.data.data || [];
                setServicos(servicosData);
                debugLog(`✅ ${servicosData.length} serviços carregados`);
                NotificationService.successToast('Serviços carregados!');
            }
        } catch (error) {
            debugLog('❌ Erro ao carregar serviços', error.message);
            NotificationService.errorToast('Erro ao carregar serviços');
        }
    };

    // Função melhorada para obter nome do cliente com múltiplas estratégias
    const getClienteNome = (projeto) => {
        if (!projeto) {
            debugLog('⚠️ Projeto inválido passado para getClienteNome');
            return 'N/A';
        }

        debugLog(`🔍 Buscando cliente para projeto "${projeto.nomeProjeto}"`, {
            idCliente: projeto.idCliente,
            totalClientesDisponiveis: clientes.length
        });

        // Estratégia 1: Usar associação direta do backend (mais eficiente)
        if (projeto.cliente?.nome) {
            debugLog(`✅ Nome encontrado via associação backend: ${projeto.cliente.nome}`);
            return projeto.cliente.nome;
        }

        // Estratégia 2: Verificar variação plural da associação
        if (projeto.clientes?.nome) {
            debugLog(`✅ Nome encontrado via associação plural: ${projeto.clientes.nome}`);
            return projeto.clientes.nome;
        }

        // Estratégia 3: Buscar na lista local com comparação robusta
        if (clientes.length > 0) {
            // Comparação exata
            let clienteEncontrado = clientes.find(c => c.idCliente === projeto.idCliente);
            if (clienteEncontrado) {
                debugLog(`✅ Cliente encontrado por ID exato: ${clienteEncontrado.nome}`);
                return clienteEncontrado.nome;
            }

            // Comparação convertendo para string (caso haja diferença de tipos)
            clienteEncontrado = clientes.find(c => String(c.idCliente) === String(projeto.idCliente));
            if (clienteEncontrado) {
                debugLog(`✅ Cliente encontrado por ID como string: ${clienteEncontrado.nome}`);
                return clienteEncontrado.nome;
            }

            // Comparação convertendo para número
            clienteEncontrado = clientes.find(c => Number(c.idCliente) === Number(projeto.idCliente));
            if (clienteEncontrado) {
                debugLog(`✅ Cliente encontrado por ID como número: ${clienteEncontrado.nome}`);
                return clienteEncontrado.nome;
            }
        }

        // Se chegou aqui, não conseguiu encontrar o cliente
        debugLog(`❌ Cliente não encontrado para projeto "${projeto.nomeProjeto}"`, {
            idClienteProcurado: projeto.idCliente,
            clientesDisponiveis: clientes.map(c => ({ id: c.idCliente, nome: c.nome }))
        });

        return 'N/A';
    };

    // Resto das funções existentes mantidas como estavam
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
            let newSelected;
            if (prev.includes(servicoId)) {
                newSelected = prev.filter(id => id !== servicoId);
            } else {
                newSelected = [...prev, servicoId];
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
                response = await api.put(
                    `/projetos/${editingProject.idProjeto}`,
                    projetoData
                );
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
            debugLog('❌ Erro ao guardar projeto', error.response?.data);
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
            debugLog('❌ Erro ao carregar serviços do projeto', error.message);
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

                const response = await api.put(
                    `/projetos/${projeto.idProjeto}`,
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
                debugLog('❌ Erro ao alterar estado do projeto', error.message);
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

    // Função de diagnóstico completo melhorada
    const diagnosticoCompleto = () => {
        const diagnostico = {
            timestamp: new Date().toISOString(),
            estados: {
                clientes: clientes.length,
                projetos: projetos.length,
                estadosProjeto: estadosProjeto.length,
                servicos: servicos.length
            },
            clientesData: clientes.map(c => ({ id: c.idCliente, nome: c.nome })),
            projetosData: projetos.map(p => ({
                nome: p.nomeProjeto,
                idCliente: p.idCliente,
                clienteAssociado: getClienteNome(p),
                temAssociacao: !!p.cliente
            })),
            localStorage: {
                token: !!localStorage.getItem('adminToken'),
                tokenLength: localStorage.getItem('adminToken')?.length || 0
            }
        };

        debugLog('🔍 DIAGNÓSTICO COMPLETO', diagnostico);
        
        // Exibe também na interface para facilitar visualização
        alert(`DIAGNÓSTICO:
Clientes: ${diagnostico.estados.clientes}
Projetos: ${diagnostico.estados.projetos}
Estados: ${diagnostico.estados.estadosProjeto}
Serviços: ${diagnostico.estados.servicos}

Ver console para detalhes completos.`);

        return diagnostico;
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
                        onClick={diagnosticoCompleto}
                        title="Executar diagnóstico completo"
                    >
                        🔍 Debug Completo
                    </button>
                    {/* Botão adicional para recarregar dados */}
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={async () => {
                            debugLog('🔄 Recarregamento manual iniciado');
                            await loadClientes();
                            await loadProjetos();
                            debugLog('✅ Recarregamento manual completo');
                        }}
                        title="Recarregar todos os dados"
                    >
                        🔄 Recarregar
                    </button>
                </div>
            </div>

            {/* Área de diagnóstico visível na interface (removível após debug) */}
            {diagnosticInfo && (
                <div className="alert alert-info mt-2" style={{ fontSize: '0.8em', maxHeight: '150px', overflow: 'auto' }}>
                    <strong>Debug Info:</strong>
                    <pre style={{ margin: 0, fontSize: '0.7em' }}>{diagnosticInfo}</pre>
                    <button 
                        className="btn btn-sm btn-outline-primary mt-1"
                        onClick={() => setDiagnosticInfo('')}
                    >
                        Limpar
                    </button>
                </div>
            )}

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
                                                <td>{getClienteNome(projeto)}</td>
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
                                                    ⚠️ Nenhum cliente carregado. Verifica a ligação à base de dados.
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
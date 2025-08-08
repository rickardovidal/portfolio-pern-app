import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationService from '../services/NotificationService';



const ClientesManager = ({ onStatsUpdate }) => {
    const [clientes, setClientes] = useState([]);
    const [tiposCliente, setTiposCliente] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTipo, setFilterTipo] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
        morada: '',
        notas: '',
        idTipo_Cliente: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        loadClientes();
        loadTiposCliente();
    }, []);

    const loadClientes = async () => {
    try {
        setLoading(true);
        NotificationService.loading('A carregar clientes...');
        
        const response = await axios.get('http://localhost:3000/api/clientes');
        if (response.data.success) {
            setClientes(response.data.data || []);
            NotificationService.closeLoading();
            NotificationService.successToast('Clientes carregados!');
        }
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        NotificationService.closeLoading();
        NotificationService.errorToast('Erro ao carregar clientes');
    } finally {
        setLoading(false);
    }
};

    const loadTiposCliente = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/tipos-clientes');
            if (response.data.success) {
                setTiposCliente(response.data.data || []);
            }
        } catch (error) {
            console.error('Erro ao carregar tipos de cliente:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpar erro específico quando o utilizador começa a digitar
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        } else if (formData.nome.length < 2) {
            newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }

        if (!formData.idTipo_Cliente) {
            newErrors.idTipo_Cliente = 'Tipo de cliente é obrigatório';
        }

        if (formData.telefone && formData.telefone.length < 9) {
            newErrors.telefone = 'Telefone deve ter pelo menos 9 dígitos';
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
        NotificationService.loading(editingClient ? 'A atualizar cliente...' : 'A criar cliente...');
        
        let response;
        if (editingClient) {
            response = await axios.put(
                `http://localhost:3000/api/clientes/${editingClient.idCliente}`,
                formData
            );
        } else {
            response = await axios.post('http://localhost:3000/api/clientes', formData);
        }

        if (response.data.success) {
            NotificationService.closeLoading();
            
            if (editingClient) {
                NotificationService.updateSuccess('Cliente');
            } else {
                NotificationService.createSuccess('Cliente');
            }
            
            handleCloseModal();
            await loadClientes();
            if (onStatsUpdate) onStatsUpdate();
        }
    } catch (error) {
        console.error('Erro ao guardar cliente:', error);
        NotificationService.closeLoading();
        
        if (error.response?.data?.message) {
            NotificationService.error('Erro!', error.response.data.message);
        } else {
            NotificationService.error('Erro!', 'Erro ao guardar cliente. Tenta novamente.');
        }
    }
};

    const handleEdit = (cliente) => {
        setEditingClient(cliente);
        setFormData({
            nome: cliente.nome || '',
            email: cliente.email || '',
            telefone: cliente.telefone || '',
            empresa: cliente.empresa || '',
            morada: cliente.morada || '',
            notas: cliente.notas || '',
            idTipo_Cliente: cliente.idTipo_Cliente || ''
        });
        setErrors({});
        setShowModal(true);
    };

    const handleDelete = async (cliente) => {
    const result = await NotificationService.confirmDelete(`o cliente "${cliente.nome}"`);
    
    if (result.isConfirmed) {
        try {
            const response = await axios.delete(`http://localhost:3000/api/clientes/${cliente.idCliente}`);
            if (response.data.success) {
                NotificationService.deleteSuccess('Cliente');
                await loadClientes();
                if (onStatsUpdate) onStatsUpdate();
            }
        } catch (error) {
            console.error('Erro ao eliminar cliente:', error);
            if (error.response?.data?.message) {
                NotificationService.error('Erro!', error.response.data.message);
            } else {
                NotificationService.error('Erro!', 'Erro ao eliminar cliente. Pode ter projetos associados.');
            }
        }
    }
};

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingClient(null);
        setFormData({
            nome: '',
            email: '',
            telefone: '',
            empresa: '',
            morada: '',
            notas: '',
            idTipo_Cliente: ''
        });
        setErrors({});
    };

    const filteredClientes = clientes.filter(cliente => {
        const matchesSearch = cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (cliente.empresa && cliente.empresa.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTipo = !filterTipo || cliente.idTipo_Cliente == filterTipo;

        return matchesSearch && matchesTipo;
    });

    const getTipoClienteNome = (idTipo) => {
        const tipo = tiposCliente.find(t => t.idTipo_Cliente == idTipo);
        return tipo ? tipo.designacaoTipo_cliente : 'N/A';
    };

    // Adicionar esta função após as outras funções helper (cerca da linha 200):
    const getTipoClienteBadgeClass = (idTipo) => {
        const tipo = tiposCliente.find(t => t.idTipo_Cliente == idTipo);
        if (!tipo) return 'bg-secondary';

        switch (tipo.designacaoTipo_cliente.toLowerCase()) {
            case 'particular':
                return 'bg-info'; // Azul para particulares
            case 'empresa':
                return 'bg-success'; // Verde para empresas
            default:
                return 'bg-secondary';
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Gestão de Clientes</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <button
                        type="button"
                        className="btn btn-primary me-2"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-person-plus me-2"></i>
                        Adicionar Cliente
                    </button>
                </div>
            </div>

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
                            placeholder="Pesquisar por nome, email ou empresa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterTipo}
                        onChange={(e) => setFilterTipo(e.target.value)}
                    >
                        <option value="">Todos os tipos</option>
                        {tiposCliente.map(tipo => (
                            <option key={tipo.idTipo_Cliente} value={tipo.idTipo_Cliente}>
                                {tipo.designacaoTipo_cliente}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <button
                        className="btn btn-outline-secondary w-100"
                        onClick={loadClientes}
                        disabled={loading}
                    >
                        {loading ? 'A atualizar...' : 'Atualizar Lista'}
                    </button>
                </div>
            </div>

            {/* Lista de Clientes */}
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
                            Lista de Clientes
                            <span className="badge bg-primary ms-2">{filteredClientes.length}</span>
                        </h5>
                    </div>
                    <div className="card-body p-0">
                        {filteredClientes.length === 0 ? (
                            <div className="text-center p-4">
                                <i className="bi bi-person-x fa-3x text-muted mb-3"></i>
                                <p className="text-muted">
                                    {searchTerm || filterTipo ? 'Nenhum cliente encontrado com os filtros aplicados.' : 'Ainda não tens clientes registados.'}
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Telefone</th>
                                            <th>Empresa</th>
                                            <th>Tipo</th>
                                            <th>Criado em</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredClientes.map(cliente => (
                                            <tr key={cliente.idCliente}>
                                                <td>
                                                    <strong>{cliente.nome}</strong>
                                                </td>
                                                <td>
                                                    <a href={`mailto:${cliente.email}`} className="text-decoration-none">
                                                        {cliente.email}
                                                    </a>
                                                </td>
                                                <td>
                                                    {cliente.telefone ? (
                                                        <a href={`tel:${cliente.telefone}`} className="text-decoration-none">
                                                            {cliente.telefone}
                                                        </a>
                                                    ) : (
                                                        <span className="text-muted">-</span>
                                                    )}
                                                </td>
                                                <td>{cliente.empresa || <span className="text-muted">-</span>}</td>
                                                <td>
                                                    <span className={`badge ${getTipoClienteBadgeClass(cliente.idTipo_Cliente)}`}>
                                                        {getTipoClienteNome(cliente.idTipo_Cliente)}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small className="text-muted">
                                                        {new Date(cliente.createdAt).toLocaleDateString('pt-PT')}
                                                    </small>
                                                </td>
                                                <td className="text-center">
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => handleEdit(cliente)}
                                                            title="Editar cliente"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(cliente)}
                                                            title="Eliminar cliente"
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

            {/* Modal para Adicionar/Editar Cliente */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingClient ? 'Editar Cliente' : 'Adicionar Novo Cliente'}
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
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="nome" className="form-label">
                                                Nome <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                                                id="nome"
                                                name="nome"
                                                value={formData.nome}
                                                onChange={handleInputChange}
                                                placeholder="Nome completo do cliente"
                                            />
                                            {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="email" className="form-label">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="email@exemplo.com"
                                            />
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="telefone" className="form-label">Telefone</label>
                                            <input
                                                type="tel"
                                                className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
                                                id="telefone"
                                                name="telefone"
                                                value={formData.telefone}
                                                onChange={handleInputChange}
                                                placeholder="9xxxxxxxxx"
                                            />
                                            {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="idTipo_Cliente" className="form-label">
                                                Tipo de Cliente <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.idTipo_Cliente ? 'is-invalid' : ''}`}
                                                id="idTipo_Cliente"
                                                name="idTipo_Cliente"
                                                value={formData.idTipo_Cliente}
                                                onChange={handleInputChange}
                                            >
                                                <option value="">Seleciona o tipo</option>
                                                {tiposCliente.map(tipo => (
                                                    <option key={tipo.idTipo_Cliente} value={tipo.idTipo_Cliente}>
                                                        {tipo.designacaoTipo_cliente}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.idTipo_Cliente && <div className="invalid-feedback">{errors.idTipo_Cliente}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="empresa" className="form-label">Empresa</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="empresa"
                                            name="empresa"
                                            value={formData.empresa}
                                            onChange={handleInputChange}
                                            placeholder="Nome da empresa (opcional)"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="morada" className="form-label">Morada</label>
                                        <textarea
                                            className="form-control"
                                            id="morada"
                                            name="morada"
                                            rows="2"
                                            value={formData.morada}
                                            onChange={handleInputChange}
                                            placeholder="Morada completa (opcional)"
                                        ></textarea>
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
                                            placeholder="Notas adicionais sobre o cliente (opcional)"
                                        ></textarea>
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
                                        {editingClient ? 'Atualizar Cliente' : 'Criar Cliente'}
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

export default ClientesManager;
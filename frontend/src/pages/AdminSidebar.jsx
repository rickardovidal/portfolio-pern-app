// AdminSidebar.jsx
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AdminSidebar = ({ activeSection, onChangeSection, onLogout }) => {
    const navItems = [
        { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
        { id: 'clientes', icon: 'bi-people', label: 'Clientes' },
        { id: 'projetos', icon: 'bi-folder', label: 'Projetos' },
        { id: 'servicos', icon: 'bi-gear', label: 'Serviços' },
        { id: 'estatisticas', icon: 'bi-graph-up', label: 'Estatísticas' }
    ];

    return (
        <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar">
            <div className="position-sticky pt-3">
                <div className="text-center mb-4">
                    <h5 className="text-primary">Área Administrativa</h5>
                    <small className="text-muted">Ricardo Vidal - Portfolio</small>
                </div>

                <ul className="nav flex-column">
                    {navItems.map((item) => (
                        <li key={item.id} className="nav-item">
                            <button
                                className={`nav-link d-flex align-items-center w-100 ${
                                    activeSection === item.id ? 'bg-primary text-white fw-bold rounded' : 'text-dark'
                                }`}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    padding: '10px 16px',
                                    textAlign: 'left'
                                }}
                                onClick={() => onChangeSection(item.id)}
                            >
                                <i className={`bi ${item.icon} me-2`}></i>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                <hr />

                <button
                    className="btn btn-outline-danger btn-sm w-100 mt-2"
                    onClick={onLogout}
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sair
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;

import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import styles from './AdminLogin.module.css';
import NotificationService from '../services/NotificationService';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Verificar se já está autenticado
        const token = localStorage.getItem('adminToken');
        if (token) {
            // ✅ CORRIGIDO - Verificar token através do middleware (GET qualquer rota protegida)
            api.get('/clientes')
                .then(() => {
                    // Token válido, redirecionar para dashboard
                    window.location.href = '/admin-dashboard';
                })
                .catch(() => {
                    // Token inválido, remover do localStorage
                    localStorage.removeItem('adminToken');
                });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validações básicas
        if (!username || !password) {
            setError('Por favor, preenche todos os campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // ✅ MANTIDO - Endpoint correto
            const response = await api.post('/auth/login', {
                username: username.trim(),
                password: password
            });

            // ✅ DEBUG TEMPORÁRIO - Remove depois de funcionar
            console.log('Login response:', response.data);

            if (response.data.success && response.data.token) {
                // Guardar token no localStorage
                localStorage.setItem('adminToken', response.data.token);
                
                // Feedback ao utilizador
                setError('');
                
                // Redirecionar imediatamente
                window.location.href = '/admin-dashboard';
                
            } else {
                setError('Credenciais inválidas. Verifica o utilizador e palavra-passe.');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            
            if (error.response?.status === 401) {
                setError('Credenciais inválidas. Verifica o utilizador e palavra-passe.');
            } else if (error.response?.status === 500) {
                setError('Erro interno do servidor. Tenta novamente.');
            } else if (error.code === 'NETWORK_ERROR' || !error.response) {
                setError('Erro de conexão. Verifica se o servidor está a funcionar.');
            } else {
                setError(error.response?.data?.message || 'Erro desconhecido. Tenta novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div className="text-center mb-4">
                    <i className="bi bi-shield-lock" style={{ fontSize: '3rem', color: '#007bff' }}></i>
                    <h2 className="mt-2">Área de Administração</h2>
                    <p className="text-muted">Portfolio - Ricardo Vidal</p>
                </div>
                
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setError('')}
                                aria-label="Close"
                            ></button>
                        </div>
                    )}
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className="form-label">
                            <i className="bi bi-person me-2"></i>
                            Utilizador
                        </label>
                        <input 
                            type="text" 
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Insire o teu utilizador"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className="form-label">
                            <i className="bi bi-lock me-2"></i>
                            Palavra-passe
                        </label>
                        <input 
                            type="password" 
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Insire a tua palavra-passe"
                            required
                            disabled={loading}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`btn btn-primary w-100 ${styles.loginButton}`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                A entrar...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Entrar
                            </>
                        )}
                    </button>
                </form>

                <hr className="my-4" />
                
                <div className="text-center mt-3">
                    <small className="text-muted">
                        Instituto Politécnico de Viseu - ESTGV
                        <br />
                        Tecnologias e Design Multimédia
                    </small>
                </div>
                
                <div className="text-center mt-2">
                    <button 
                        type="button"
                        className="btn btn-link btn-sm text-muted"
                        onClick={() => window.location.href = '/'}
                    >
                        <i className="bi bi-arrow-left me-1"></i>
                        Voltar ao Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
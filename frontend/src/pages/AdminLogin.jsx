// AdminLogin.jsx - VERSÃO COMPLETAMENTE CORRIGIDA
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('admin'); // ✅ Pre-filled para teste
    const [password, setPassword] = useState('odracirladiv'); // ✅ Pre-filled para teste
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Verificar se já está autenticado
        const token = localStorage.getItem('adminToken');
        if (token) {
            console.log('🔍 Token encontrado, verificando...');
            
            // ✅ CORRIGIDO - Usar método POST para verificação (conforme o teu backend)
            api.post('/auth/verify')
                .then(() => {
                    console.log('✅ Token válido - redirecionando');
                    window.location.href = '/admin-dashboard';
                })
                .catch((err) => {
                    console.log('❌ Token inválido:', err.message);
                    localStorage.removeItem('adminToken');
                });
        }
    }, []);

    const handleSubmit = async (e) => {
        // ✅ CRÍTICO - Prevenir comportamentos padrão do form
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🚀 INICIANDO LOGIN...');
        
        // Validações básicas
        if (!username || !password) {
            setError('Por favor, preenche todos os campos');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const requestData = {
                username: username.trim(),
                password: password
            };
            
            console.log('📤 Enviando request:', requestData);
            console.log('📤 URL:', `${api.defaults.baseURL}/auth/login`);

            // ✅ CORRIGIDO - Usar o serviço api.js em vez de axios direto
            const response = await api.post('/auth/login', requestData);

            console.log('✅ RESPOSTA RECEBIDA:', response.status);
            console.log('✅ Data:', response.data);

            if (response.data.success && response.data.token) {
                console.log('🎯 LOGIN SUCESSO!');
                
                // Guardar token no localStorage
                localStorage.setItem('adminToken', response.data.token);
                
                // ✅ Limpar erro e mostrar sucesso
                setError('');
                
                // ✅ Redirecionar após sucesso
                setTimeout(() => {
                    window.location.href = '/admin-dashboard';
                }, 1000);
                
            } else {
                console.log('❌ LOGIN FALHOU:', response.data);
                setError('Login falhou - resposta inválida');
            }
        } catch (error) {
            console.error('💥 ERRO COMPLETO:', error);
            
            if (error.response) {
                console.error('💥 Response status:', error.response.status);
                console.error('💥 Response data:', error.response.data);
                
                if (error.response.status === 401) {
                    setError('Credenciais inválidas. Verifica o utilizador e palavra-passe.');
                } else if (error.response.status === 500) {
                    setError('Erro interno do servidor. Tenta novamente.');
                } else {
                    setError(error.response?.data?.message || 'Erro do servidor');
                }
            } else if (error.request) {
                console.error('💥 Sem resposta do servidor:', error.request);
                setError('Sem resposta do servidor. Verifica a conexão.');
            } else {
                console.error('💥 Erro de configuração:', error.message);
                setError('Erro de configuração: ' + error.message);
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
                
                {/* ✅ CORRIGIDO - Form com onSubmit adequado */}
                <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
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
                            autoComplete="username"
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
                            autoComplete="current-password"
                        />
                    </div>
                    
                    {/* ✅ CORRIGIDO - Botão do tipo submit */}
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
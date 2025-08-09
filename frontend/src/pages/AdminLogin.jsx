import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import styles from './AdminLogin.module.css';
import NotificationService from '../services/NotificationService';

const AdminLogin = () => {
    const [username, setUsername] = useState('admin'); // ✅ Pre-filled para teste
    const [password, setPassword] = useState('odracirladiv'); // ✅ Pre-filled para teste
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState(''); // ✅ Estado para mostrar debug na tela

    useEffect(() => {
        // ✅ Log persistente da configuração
        const baseURL = api.defaults.baseURL;
        console.error('🔧 API Base URL:', baseURL);
        setDebugInfo(prev => prev + `\n🔧 API Base URL: ${baseURL}`);
        
        // Verificar se já está autenticado
        const token = localStorage.getItem('adminToken');
        if (token) {
            console.error('🔍 Token encontrado, verificando...');
            setDebugInfo(prev => prev + '\n🔍 Token encontrado, verificando...');
            
            api.get('/clientes')
                .then(() => {
                    console.error('✅ Token válido - redirecionando');
                    window.location.href = '/admin-dashboard';
                })
                .catch((err) => {
                    console.error('❌ Token inválido:', err);
                    setDebugInfo(prev => prev + `\n❌ Token inválido: ${err.message}`);
                    localStorage.removeItem('adminToken');
                });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ✅ Prevenir qualquer refresh automático
        e.stopPropagation();
        
        console.error('🚀 INICIANDO LOGIN...');
        setDebugInfo(prev => prev + '\n🚀 INICIANDO LOGIN...');
        
        // Validações básicas
        if (!username || !password) {
            const errorMsg = 'Por favor, preenche todos os campos';
            console.error('❌ Validação falhou:', errorMsg);
            setError(errorMsg);
            setDebugInfo(prev => prev + `\n❌ Validação falhou: ${errorMsg}`);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const requestData = {
                username: username.trim(),
                password: password
            };
            
            console.error('📤 Enviando request:', requestData);
            console.error('📤 URL completa:', `${api.defaults.baseURL}/auth/login`);
            setDebugInfo(prev => prev + `\n📤 Enviando: ${JSON.stringify(requestData)}`);
            setDebugInfo(prev => prev + `\n📤 URL: ${api.defaults.baseURL}/auth/login`);

            const response = await api.post('/auth/login', requestData);

            console.error('✅ RESPOSTA RECEBIDA:', response);
            console.error('✅ Status:', response.status);
            console.error('✅ Data:', response.data);
            
            setDebugInfo(prev => prev + `\n✅ Status: ${response.status}`);
            setDebugInfo(prev => prev + `\n✅ Response: ${JSON.stringify(response.data, null, 2)}`);

            if (response.data.success && response.data.token) {
                console.error('🎯 LOGIN SUCESSO! Token:', response.data.token.substring(0, 20) + '...');
                setDebugInfo(prev => prev + '\n🎯 LOGIN SUCESSO!');
                
                // Guardar token no localStorage
                localStorage.setItem('adminToken', response.data.token);
                
                // ✅ Pausa antes de redirecionar para ver logs
                setTimeout(() => {
                    window.location.href = '/admin-dashboard';
                }, 2000);
                
            } else {
                const errorMsg = 'Login falhou - resposta inválida';
                console.error('❌ LOGIN FALHOU:', response.data);
                setDebugInfo(prev => prev + `\n❌ LOGIN FALHOU: ${JSON.stringify(response.data)}`);
                setError(errorMsg);
            }
        } catch (error) {
            console.error('💥 ERRO COMPLETO:', error);
            console.error('💥 Error message:', error.message);
            console.error('💥 Error stack:', error.stack);
            
            setDebugInfo(prev => prev + `\n💥 ERRO: ${error.message}`);
            
            if (error.response) {
                console.error('💥 Response status:', error.response.status);
                console.error('💥 Response data:', error.response.data);
                console.error('💥 Response headers:', error.response.headers);
                
                setDebugInfo(prev => prev + `\n💥 Status: ${error.response.status}`);
                setDebugInfo(prev => prev + `\n💥 Response: ${JSON.stringify(error.response.data, null, 2)}`);
                
                if (error.response.status === 401) {
                    setError('Credenciais inválidas. Verifica o utilizador e palavra-passe.');
                } else if (error.response.status === 500) {
                    setError('Erro interno do servidor. Tenta novamente.');
                } else {
                    setError(error.response?.data?.message || 'Erro do servidor');
                }
            } else if (error.request) {
                console.error('💥 Request made but no response:', error.request);
                setDebugInfo(prev => prev + '\n💥 Sem resposta do servidor');
                setError('Sem resposta do servidor. Verifica a conexão.');
            } else {
                console.error('💥 Error config:', error.config);
                setDebugInfo(prev => prev + `\n💥 Config error: ${error.message}`);
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
                    <div className="badge bg-warning">DEBUG MODE</div>
                </div>
                
                {/* ✅ Painel de Debug Visível */}
                {debugInfo && (
                    <div className="alert alert-info" style={{ fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
                        <strong>🔍 Debug Info:</strong>
                        <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{debugInfo}</pre>
                    </div>
                )}
                
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
                                Entrar (Debug)
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
                        <br />
                        <span className="badge bg-info mt-1">Modo Debug - Logs Persistentes</span>
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
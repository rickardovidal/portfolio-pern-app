// AdminLogin.jsx - VERSÃO DE DEBUG COMPLETA
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('odracirladiv');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [debugLogs, setDebugLogs] = useState([]);
    const [serverStatus, setServerStatus] = useState('checking');

    // Função para adicionar logs de debug
    const addDebugLog = (message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
        console.log(logEntry);
        setDebugLogs(prev => [...prev, logEntry]);
    };

    // Verificar status do servidor
    const checkServerStatus = async () => {
        try {
            addDebugLog('🔍 Verificando se o servidor está online...');
            const response = await fetch('http://localhost:3000/api', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                addDebugLog(`✅ Servidor online! Versão: ${data.version}`, 'success');
                setServerStatus('online');
                return true;
            } else {
                addDebugLog(`❌ Servidor respondeu com status: ${response.status}`, 'error');
                setServerStatus('error');
                return false;
            }
        } catch (error) {
            addDebugLog(`💥 Erro ao conectar ao servidor: ${error.message}`, 'error');
            setServerStatus('offline');
            return false;
        }
    };

    // Testar endpoint de login diretamente
    const testLoginEndpoint = async () => {
        try {
            addDebugLog('🧪 Testando endpoint /auth/login...');
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: 'teste',
                    password: 'teste'
                })
            });
            
            const data = await response.json();
            addDebugLog(`🧪 Teste endpoint: Status ${response.status}, Response: ${JSON.stringify(data)}`, 'info');
        } catch (error) {
            addDebugLog(`💥 Erro no teste do endpoint: ${error.message}`, 'error');
        }
    };

    useEffect(() => {
        const initializeDebug = async () => {
            addDebugLog('🚀 Iniciando diagnóstico completo...');
            addDebugLog(`📍 API Base URL: ${api.defaults.baseURL}`);
            
            const serverOnline = await checkServerStatus();
            if (serverOnline) {
                await testLoginEndpoint();
            }
            
            // Verificar token existente
            const token = localStorage.getItem('adminToken');
            if (token) {
                addDebugLog('🔑 Token encontrado no localStorage');
                addDebugLog(`🔑 Token (primeiros 20 chars): ${token.substring(0, 20)}...`);
                
                try {
                    const verifyResponse = await api.post('/auth/verify');
                    addDebugLog('✅ Token válido - redirecionando', 'success');
                    window.location.href = '/admin-dashboard';
                } catch (err) {
                    addDebugLog(`❌ Token inválido: ${err.message}`, 'error');
                    localStorage.removeItem('adminToken');
                }
            } else {
                addDebugLog('🔑 Nenhum token encontrado');
            }
        };
        
        initializeDebug();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        addDebugLog('🚀 TENTATIVA DE LOGIN INICIADA');
        addDebugLog(`👤 Username: "${username}"`);
        addDebugLog(`🔒 Password length: ${password.length} chars`);
        
        if (!username || !password) {
            const errorMsg = 'Por favor, preenche todos os campos';
            setError(errorMsg);
            addDebugLog(`❌ Validação falhou: ${errorMsg}`, 'error');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const requestData = {
                username: username.trim(),
                password: password
            };
            
            addDebugLog(`📤 Enviando dados: ${JSON.stringify({...requestData, password: '***'})}`);
            addDebugLog(`🌐 URL completa: ${api.defaults.baseURL}/auth/login`);

            // Fazer o request usando fetch diretamente para melhor debug
            const response = await fetch(`${api.defaults.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            addDebugLog(`📥 Response status: ${response.status}`);
            addDebugLog(`📥 Response headers: ${JSON.stringify(Object.fromEntries(response.headers))}`);

            const responseText = await response.text();
            addDebugLog(`📥 Response body (raw): ${responseText}`);

            let data;
            try {
                data = JSON.parse(responseText);
                addDebugLog(`📥 Response body (parsed): ${JSON.stringify(data, null, 2)}`);
            } catch (parseError) {
                addDebugLog(`💥 Erro ao fazer parse da resposta: ${parseError.message}`, 'error');
                throw new Error('Resposta do servidor não é JSON válido');
            }

            if (response.ok && data.success && data.token) {
                addDebugLog('🎯 LOGIN SUCESSO!', 'success');
                addDebugLog(`🔑 Token recebido: ${data.token.substring(0, 20)}...`);
                
                localStorage.setItem('adminToken', data.token);
                setError('');
                
                addDebugLog('✅ Token guardado, redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = '/admin-dashboard';
                }, 1500);
                
            } else {
                const errorMsg = data.message || 'Login falhou - resposta inválida';
                addDebugLog(`❌ LOGIN FALHOU: ${errorMsg}`, 'error');
                setError(errorMsg);
            }
        } catch (error) {
            addDebugLog(`💥 ERRO CAPTURADO: ${error.message}`, 'error');
            addDebugLog(`💥 Error stack: ${error.stack}`, 'error');
            
            if (error.response) {
                addDebugLog(`💥 Error response: ${JSON.stringify(error.response)}`, 'error');
                setError(error.response?.data?.message || 'Erro do servidor');
            } else if (error.request) {
                addDebugLog('💥 Erro de network - sem resposta do servidor', 'error');
                setError('Sem resposta do servidor. Verifica se está a correr.');
            } else {
                setError('Erro: ' + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const clearLogs = () => {
        setDebugLogs([]);
        addDebugLog('🧹 Logs limpos');
    };

    const testDifferentCredentials = async () => {
        const credentialsToTest = [
            { username: 'admin', password: 'admin' },
            { username: 'admin', password: 'password' },
            { username: 'admin', password: '123456' },
            { username: 'admin', password: 'odracirladiv' },
            { username: 'ricardo', password: 'admin' }
        ];

        addDebugLog('🧪 Testando diferentes credenciais...');
        
        for (const creds of credentialsToTest) {
            try {
                const response = await fetch(`${api.defaults.baseURL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(creds)
                });
                
                const data = await response.json();
                addDebugLog(`🧪 ${creds.username}/${creds.password} → Status: ${response.status}, Success: ${data.success}`);
            } catch (error) {
                addDebugLog(`🧪 ${creds.username}/${creds.password} → Erro: ${error.message}`);
            }
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox} style={{ maxWidth: '800px' }}>
                <div className="text-center mb-4">
                    <i className="bi bi-shield-lock" style={{ fontSize: '3rem', color: '#007bff' }}></i>
                    <h2 className="mt-2">Área de Administração</h2>
                    <p className="text-muted">Portfolio - Ricardo Vidal</p>
                    <div className={`badge ${
                        serverStatus === 'online' ? 'bg-success' : 
                        serverStatus === 'offline' ? 'bg-danger' : 
                        'bg-warning'
                    }`}>
                        Servidor: {serverStatus}
                    </div>
                </div>
                
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
                    
                    <div className="row">
                        <div className="col-md-6">
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
                        </div>
                        <div className="col-md-6">
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
                        </div>
                    </div>
                    
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mb-3">
                        <button 
                            type="button" 
                            className="btn btn-outline-info btn-sm"
                            onClick={testDifferentCredentials}
                            disabled={loading}
                        >
                            🧪 Testar Credenciais
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary btn-sm"
                            onClick={clearLogs}
                        >
                            🧹 Limpar Logs
                        </button>
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
                                Entrar (DEBUG)
                            </>
                        )}
                    </button>
                </form>

                {/* Painel de Debug */}
                <div className="mt-4">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">🔍 Debug Console</h6>
                            <small className="text-muted">{debugLogs.length} logs</small>
                        </div>
                        <div className="card-body p-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {debugLogs.length === 0 ? (
                                <p className="text-muted mb-0">Nenhum log ainda...</p>
                            ) : (
                                <pre style={{ 
                                    fontSize: '11px', 
                                    margin: 0, 
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'Consolas, monospace'
                                }}>
                                    {debugLogs.join('\n')}
                                </pre>
                            )}
                        </div>
                    </div>
                </div>

                <hr className="my-4" />
                
                <div className="text-center">
                    <small className="text-muted">
                        Instituto Politécnico de Viseu - ESTGV<br />
                        Tecnologias e Design Multimédia<br />
                        <span className="badge bg-warning mt-1">MODO DEBUG ATIVO</span>
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
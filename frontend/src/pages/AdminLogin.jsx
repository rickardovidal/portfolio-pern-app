// AdminLogin.jsx - VERSÃO PARA PRODUÇÃO (RENDER + VERCEL)
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('odracirladiv');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [debugInfo, setDebugInfo] = useState('');
    const [serverStatus, setServerStatus] = useState('checking');

    // Função para adicionar informações de debug
    const addDebugInfo = (message) => {
        const timestamp = new Date().toLocaleTimeString();
        const logMessage = `[${timestamp}] ${message}`;
        console.log(logMessage);
        setDebugInfo(prev => prev + '\n' + logMessage);
    };

    // Verificar status do servidor backend no Render
    const checkServerStatus = async () => {
        try {
            addDebugInfo('🔍 Verificando status do servidor Render...');
            const baseURL = api.defaults.baseURL;
            addDebugInfo(`🌐 Backend URL: ${baseURL}`);
            
            // Fazer uma requisição simples para verificar se o servidor responde
            const response = await fetch(`${baseURL.replace('/api', '')}/api`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Adicionar timeout para evitar que fique em loading infinito
                signal: AbortSignal.timeout(10000)
            });
            
            if (response.ok) {
                const data = await response.json();
                addDebugInfo(`✅ Servidor Render online! Versão: ${data.version || 'N/A'}`);
                setServerStatus('online');
                return true;
            } else {
                addDebugInfo(`❌ Servidor respondeu com status: ${response.status}`);
                setServerStatus('error');
                return false;
            }
        } catch (error) {
            addDebugInfo(`💥 Erro ao conectar ao Render: ${error.message}`);
            setServerStatus('offline');
            
            // Se o servidor não responder, pode estar em cold start (comum no Render)
            if (error.name === 'TimeoutError') {
                addDebugInfo('⏰ Timeout - servidor pode estar em cold start no Render');
            }
            return false;
        }
    };

    useEffect(() => {
        const initializeApp = async () => {
            addDebugInfo('🚀 Iniciando aplicação em produção (Vercel + Render)');
            addDebugInfo(`📱 User Agent: ${navigator.userAgent.substring(0, 50)}...`);
            addDebugInfo(`🌍 Location: ${window.location.href}`);
            
            // Verificar token existente
            const token = localStorage.getItem('adminToken');
            if (token) {
                addDebugInfo('🔑 Token encontrado no localStorage');
                try {
                    // Tentar verificar token existente
                    const verifyResponse = await api.post('/auth/verify');
                    if (verifyResponse.data.success) {
                        addDebugInfo('✅ Token válido - redirecionando para dashboard');
                        window.location.href = '/admin-dashboard';
                        return;
                    }
                } catch (err) {
                    addDebugInfo(`❌ Token inválido: ${err.message}`);
                    localStorage.removeItem('adminToken');
                }
            }
            
            // Verificar status do servidor
            await checkServerStatus();
        };
        
        initializeApp();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        addDebugInfo('🚀 Tentativa de login iniciada');
        addDebugInfo(`👤 Username: "${username}"`);
        addDebugInfo(`🔒 Password length: ${password.length} caracteres`);
        
        // Validação básica
        if (!username?.trim() || !password?.trim()) {
            const errorMsg = 'Por favor, preenche todos os campos';
            setError(errorMsg);
            addDebugInfo(`❌ Validação falhou: ${errorMsg}`);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const requestData = {
                username: username.trim(),
                password: password.trim()
            };
            
            addDebugInfo(`📤 Enviando request para: ${api.defaults.baseURL}/auth/login`);
            addDebugInfo(`📤 Dados: ${JSON.stringify({...requestData, password: '*'.repeat(requestData.password.length)})}`);

            // Fazer request com timeout mais longo para produção
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos

            const response = await fetch(`${api.defaults.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            addDebugInfo(`📥 Response status: ${response.status}`);
            addDebugInfo(`📥 Response ok: ${response.ok}`);
            
            // Ler resposta como texto primeiro para debug
            const responseText = await response.text();
            addDebugInfo(`📥 Response body (${responseText.length} chars): ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);

            // Tentar fazer parse do JSON
            let data;
            try {
                data = JSON.parse(responseText);
                addDebugInfo(`📥 JSON parsed successfully`);
            } catch (parseError) {
                addDebugInfo(`💥 Erro ao fazer parse do JSON: ${parseError.message}`);
                throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 100)}...`);
            }

            if (response.ok && data.success && data.token) {
                addDebugInfo('🎯 LOGIN SUCESSO!');
                addDebugInfo(`🔑 Token recebido (primeiros 20 chars): ${data.token.substring(0, 20)}...`);
                
                // Guardar token
                localStorage.setItem('adminToken', data.token);
                setError('');
                
                addDebugInfo('✅ Token guardado com sucesso');
                addDebugInfo('🔄 Redirecionando para dashboard...');
                
                // Redirecionar após pequeno delay
                setTimeout(() => {
                    window.location.href = '/admin-dashboard';
                }, 1000);
                
            } else {
                // Login falhou
                const errorMsg = data.message || `Login falhou (Status: ${response.status})`;
                addDebugInfo(`❌ LOGIN FALHOU: ${errorMsg}`);
                
                if (response.status === 401) {
                    setError('Credenciais inválidas. Verifica o utilizador e palavra-passe.');
                } else if (response.status >= 500) {
                    setError('Erro interno do servidor. O servidor pode estar a reiniciar (cold start).');
                } else {
                    setError(errorMsg);
                }
            }
        } catch (error) {
            addDebugInfo(`💥 ERRO CAPTURADO: ${error.name} - ${error.message}`);
            
            if (error.name === 'AbortError') {
                setError('Timeout: O servidor demorou muito a responder. Tenta novamente.');
                addDebugInfo('⏰ Timeout - servidor pode estar em cold start');
            } else if (error.message.includes('Failed to fetch')) {
                setError('Erro de conexão: Não foi possível conectar ao servidor.');
                addDebugInfo('🌐 Erro de rede - verificar CORS ou URL do backend');
            } else {
                setError(`Erro: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const clearDebugInfo = () => {
        setDebugInfo('');
        addDebugInfo('🧹 Debug info limpo');
    };

    const testConnection = async () => {
        addDebugInfo('🧪 Testando conexão manual...');
        await checkServerStatus();
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox} style={{ maxWidth: '600px' }}>
                <div className="text-center mb-4">
                    <i className="bi bi-shield-lock" style={{ fontSize: '3rem', color: '#007bff' }}></i>
                    <h2 className="mt-2">Área de Administração</h2>
                    <p className="text-muted">Portfolio - Ricardo Vidal</p>
                    <div className="d-flex justify-content-center gap-2">
                        <span className="badge bg-info">Vercel Frontend</span>
                        <span className={`badge ${
                            serverStatus === 'online' ? 'bg-success' : 
                            serverStatus === 'offline' ? 'bg-danger' : 
                            'bg-warning'
                        }`}>
                            Render Backend: {serverStatus}
                        </span>
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
                    
                    <div className="d-flex gap-2 mb-3">
                        <button 
                            type="button" 
                            className="btn btn-outline-info btn-sm flex-fill"
                            onClick={testConnection}
                            disabled={loading}
                        >
                            🧪 Testar Conexão
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-outline-secondary btn-sm flex-fill"
                            onClick={clearDebugInfo}
                        >
                            🧹 Limpar Debug
                        </button>
                    </div>
                    
                    <button 
                        type="submit" 
                        className={`btn btn-primary w-100 ${styles.loginButton}`}
                        disabled={loading || serverStatus === 'offline'}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                A entrar...
                            </>
                        ) : serverStatus === 'offline' ? (
                            <>
                                <i className="bi bi-wifi-off me-2"></i>
                                Servidor Offline
                            </>
                        ) : (
                            <>
                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                Entrar
                            </>
                        )}
                    </button>
                </form>

                {/* Painel de Debug */}
                {debugInfo && (
                    <div className="mt-4">
                        <div className="card">
                            <div className="card-header">
                                <h6 className="mb-0">🔍 Debug Info (Produção)</h6>
                            </div>
                            <div className="card-body p-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                <pre style={{ 
                                    fontSize: '10px', 
                                    margin: 0, 
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: 'Consolas, monospace'
                                }}>
                                    {debugInfo}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

                <hr className="my-4" />
                
                <div className="text-center">
                    <small className="text-muted">
                        Instituto Politécnico de Viseu - ESTGV<br />
                        Tecnologias e Design Multimédia<br />
                        <span className="badge bg-success mt-1">PRODUÇÃO ATIVA</span>
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
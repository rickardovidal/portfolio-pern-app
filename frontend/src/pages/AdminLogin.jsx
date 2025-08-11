// AdminLogin.jsx - VERSÃO SEGURA E LIMPA
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import styles from './AdminLogin.module.css';

const AdminLogin = () => {
    // Estados principais - CREDENCIAIS REMOVIDAS POR SEGURANÇA
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Verificar se já existe token válido ao carregar a página
    useEffect(() => {
        const checkExistingToken = async () => {
            const token = localStorage.getItem('adminToken');
            if (token) {
                try {
                    // Tentar verificar se o token ainda é válido
                    const verifyResponse = await api.post('/auth/verify');
                    if (verifyResponse.data.success) {
                        // Token válido - redirecionar directamente
                        window.location.href = '/admin-dashboard';
                        return;
                    }
                } catch (err) {
                    // Token inválido - remover do localStorage
                    localStorage.removeItem('adminToken');
                }
            }
        };
        
        checkExistingToken();
    }, []);

    // Função principal de login
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validação básica dos campos
        if (!username.trim() || !password.trim()) {
            setError('Por favor, preenche todos os campos.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Preparar dados para envio
            const loginData = {
                username: username.trim(),
                password: password.trim()
            };

            // Fazer request de login
            const response = await api.post('/auth/login', loginData);

            if (response.data.success && response.data.token) {
                // Login bem sucedido
                localStorage.setItem('adminToken', response.data.token);
                
                // Redirecionar para dashboard
                window.location.href = '/admin-dashboard';
            } else {
                // Login falhou
                setError(response.data.message || 'Erro no login');
            }

        } catch (error) {
            // Tratar diferentes tipos de erro
            if (error.response?.status === 401) {
                setError('Credenciais inválidas. Verifica o utilizador e palavra-passe.');
            } else if (error.response?.status >= 500) {
                setError('Erro interno do servidor. Tenta novamente em alguns momentos.');
            } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
                setError('Erro de conexão. Verifica a tua ligação à internet.');
            } else {
                setError('Erro inesperado. Tenta novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                {/* Cabeçalho limpo e profissional */}
                <div className="text-center mb-4">
                    <h2>Área de Administração</h2>
                    <p className="text-muted">Portfolio - Ricardo Vidal</p>
                </div>
                
                {/* Formulário de login */}
                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    {/* Exibição de erros quando necessário */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                            <button 
                                type="button" 
                                className="btn-close float-end" 
                                onClick={() => setError('')}
                                aria-label="Fechar"
                            ></button>
                        </div>
                    )}
                    
                    {/* Campo de utilizador */}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Utilizador
                        </label>
                        <input 
                            type="text" 
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Insere o teu utilizador"
                            required
                            disabled={loading}
                            autoComplete="username"
                        />
                    </div>
                    
                    {/* Campo de password */}
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Palavra-passe
                        </label>
                        <input 
                            type="password" 
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Insere a tua palavra-passe"
                            required
                            disabled={loading}
                            autoComplete="current-password"
                        />
                    </div>
                    
                    {/* Botão de submit */}
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                A entrar...
                            </>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </form>

                {/* Rodapé com informações */}
                <hr className="my-4" />
                <div className="text-center">
                    <small className="text-muted">
                        Instituto Politécnico de Viseu - ESTGV<br />
                        Tecnologias e Design Multimédia
                    </small>
                </div>
                
                {/* Link para voltar ao portfolio */}
                <div className="text-center mt-3">
                    <button 
                        type="button"
                        className="btn btn-link btn-sm"
                        onClick={() => window.location.href = '/'}
                    >
                        Voltar ao Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
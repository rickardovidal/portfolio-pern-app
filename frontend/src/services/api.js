// src/services/api.js
import axios from 'axios';

// Configurar base URL da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Criar instância do axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 segundos
    headers: {
        'Content-Type': 'application/json',
    }
});

// Interceptor para requests (adicionar token se existir)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para responses (tratar erros globalmente)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido ou expirado
            localStorage.removeItem('adminToken');
            // Só redirecionar se estivermos numa página administrativa
            if (window.location.pathname.includes('/admin')) {
                window.location.href = '/admin-login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
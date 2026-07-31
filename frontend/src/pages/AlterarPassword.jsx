// AlterarPassword.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import NotificationService from '../services/NotificationService';

const AlterarPassword = () => {
    const [userId, setUserId] = useState(null);
    const [passwordAtual, setPasswordAtual] = useState('');
    const [novaPassword, setNovaPassword] = useState('');
    const [confirmarPassword, setConfirmarPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mostrarPasswordAtual, setMostrarPasswordAtual] = useState(false);
    const [mostrarNovaPassword, setMostrarNovaPassword] = useState(false);
    const [mostrarConfirmarPassword, setMostrarConfirmarPassword] = useState(false);

    useEffect(() => {
        const carregarUtilizador = async () => {
            try {
                const response = await api.post('/auth/verify');
                setUserId(response.data.user.id);
            } catch (error) {
                console.error('Erro ao obter utilizador:', error);
                NotificationService.errorToast('Não foi possível identificar o utilizador');
            }
        };

        carregarUtilizador();
    }, []);

    const limparFormulario = () => {
        setPasswordAtual('');
        setNovaPassword('');
        setConfirmarPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!passwordAtual || !novaPassword || !confirmarPassword) {
            NotificationService.validationError('Preenche todos os campos');
            return;
        }

        if (novaPassword.length < 6) {
            NotificationService.validationError('A nova password deve ter pelo menos 6 caracteres');
            return;
        }

        if (novaPassword !== confirmarPassword) {
            NotificationService.validationError('A nova password e a confirmação não coincidem');
            return;
        }

        if (!userId) {
            NotificationService.errorToast('Utilizador não identificado, tenta novamente');
            return;
        }

        try {
            setLoading(true);
            const response = await api.put(`/utilizadores/${userId}/password`, {
                passwordAtual,
                novaPassword
            });

            if (response.data.success) {
                NotificationService.successToast('Password alterada com sucesso!');
                limparFormulario();
            }
        } catch (error) {
            if (error.response?.status === 401) {
                NotificationService.errorToast('Password atual incorreta');
            } else {
                console.error('Erro ao alterar password:', error);
                NotificationService.errorToast('Erro ao alterar password');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Alterar Password</h1>
            </div>

            <div className="row">
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="passwordAtual" className="form-label">
                                        Password atual
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={mostrarPasswordAtual ? 'text' : 'password'}
                                            id="passwordAtual"
                                            className="form-control"
                                            value={passwordAtual}
                                            onChange={(e) => setPasswordAtual(e.target.value)}
                                            autoComplete="current-password"
                                            disabled={loading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setMostrarPasswordAtual(!mostrarPasswordAtual)}
                                            tabIndex={-1}
                                            aria-label={mostrarPasswordAtual ? 'Ocultar password' : 'Mostrar password'}
                                        >
                                            <i className={`bi ${mostrarPasswordAtual ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="novaPassword" className="form-label">
                                        Nova password
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={mostrarNovaPassword ? 'text' : 'password'}
                                            id="novaPassword"
                                            className="form-control"
                                            value={novaPassword}
                                            onChange={(e) => setNovaPassword(e.target.value)}
                                            autoComplete="new-password"
                                            disabled={loading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setMostrarNovaPassword(!mostrarNovaPassword)}
                                            tabIndex={-1}
                                            aria-label={mostrarNovaPassword ? 'Ocultar password' : 'Mostrar password'}
                                        >
                                            <i className={`bi ${mostrarNovaPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="confirmarPassword" className="form-label">
                                        Confirmar nova password
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={mostrarConfirmarPassword ? 'text' : 'password'}
                                            id="confirmarPassword"
                                            className="form-control"
                                            value={confirmarPassword}
                                            onChange={(e) => setConfirmarPassword(e.target.value)}
                                            autoComplete="new-password"
                                            disabled={loading}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => setMostrarConfirmarPassword(!mostrarConfirmarPassword)}
                                            tabIndex={-1}
                                            aria-label={mostrarConfirmarPassword ? 'Ocultar password' : 'Mostrar password'}
                                        >
                                            <i className={`bi ${mostrarConfirmarPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            A alterar...
                                        </>
                                    ) : (
                                        'Alterar Password'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AlterarPassword;

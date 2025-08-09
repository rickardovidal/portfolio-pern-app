// src/components/sections/ContactForm.jsx
import React, { useState } from 'react';
import api from '../../services/api';
import styles from './ContactForm.module.css';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        empresa: '',
        assunto: '',
        mensagem: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
    const [errors, setErrors] = useState({});

    // Validação dos campos
    const validateForm = () => {
        const newErrors = {};

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório';
        } else if (formData.nome.trim().length < 2) {
            newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Formato de email inválido';
        }

        if (!formData.assunto.trim()) {
            newErrors.assunto = 'Assunto é obrigatório';
        } else if (formData.assunto.trim().length < 5) {
            newErrors.assunto = 'Assunto deve ter pelo menos 5 caracteres';
        }

        if (!formData.mensagem.trim()) {
            newErrors.mensagem = 'Mensagem é obrigatória';
        } else if (formData.mensagem.trim().length < 10) {
            newErrors.mensagem = 'Mensagem deve ter pelo menos 10 caracteres';
        }

        if (formData.telefone && formData.telefone.length > 20) {
            newErrors.telefone = 'Telefone não pode ter mais de 20 caracteres';
        }

        if (formData.empresa && formData.empresa.length > 100) {
            newErrors.empresa = 'Nome da empresa não pode ter mais de 100 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Actualizar campos do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Limpar erro do campo quando o utilizador começa a escrever
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Submeter formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            const response = await api.post('/contact', formData);

            if (response.data.success) {
                setSubmitStatus('success');
                // Limpar formulário após sucesso
                setFormData({
                    nome: '',
                    email: '',
                    telefone: '',
                    empresa: '',
                    assunto: '',
                    mensagem: ''
                });
            } else {
                setSubmitStatus('error');
            }

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            setSubmitStatus('error');
            
            // Se houver erros de validação do backend
            if (error.response?.data?.errors) {
                const backendErrors = {};
                error.response.data.errors.forEach(errorMsg => {
                    // Mapear erros do backend para campos do formulário
                    if (errorMsg.includes('nome')) backendErrors.nome = errorMsg;
                    else if (errorMsg.includes('email')) backendErrors.email = errorMsg;
                    else if (errorMsg.includes('assunto')) backendErrors.assunto = errorMsg;
                    else if (errorMsg.includes('mensagem')) backendErrors.mensagem = errorMsg;
                });
                setErrors(backendErrors);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className={styles.contactForm} id="contact-form">
            <div className={styles.contactFormContainer}>
                <div className={styles.contactFormHeader}>
                    <div className={styles.contactFormLabel}>Contacto</div>
                    <h2 className={styles.contactFormTitle}>
                        Vamos trabalhar juntos no teu próximo projeto
                    </h2>
                    <p className={styles.contactFormSubtitle}>
                        Envia-me uma mensagem e entrarei em contacto contigo brevemente para discutirmos 
                        as tuas necessidades e como posso ajudar.
                    </p>
                </div>

                <div className={styles.contactFormContent}>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {/* Primeira linha - Nome e Email */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="nome" className={styles.formLabel}>
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    id="nome"
                                    name="nome"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.nome ? styles.formInputError : ''}`}
                                    placeholder="O seu nome completo"
                                    maxLength={100}
                                />
                                {errors.nome && (
                                    <span className={styles.formError}>{errors.nome}</span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="email" className={styles.formLabel}>
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
                                    placeholder="nome@exemplo.com"
                                    maxLength={150}
                                />
                                {errors.email && (
                                    <span className={styles.formError}>{errors.email}</span>
                                )}
                            </div>
                        </div>

                        {/* Segunda linha - Telefone e Empresa */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="telefone" className={styles.formLabel}>
                                    Telefone
                                </label>
                                <input
                                    type="tel"
                                    id="telefone"
                                    name="telefone"
                                    value={formData.telefone}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.telefone ? styles.formInputError : ''}`}
                                    placeholder="+351 xxx xxx xxx"
                                    maxLength={20}
                                />
                                {errors.telefone && (
                                    <span className={styles.formError}>{errors.telefone}</span>
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="empresa" className={styles.formLabel}>
                                    Empresa/Organização
                                </label>
                                <input
                                    type="text"
                                    id="empresa"
                                    name="empresa"
                                    value={formData.empresa}
                                    onChange={handleChange}
                                    className={`${styles.formInput} ${errors.empresa ? styles.formInputError : ''}`}
                                    placeholder="Nome da empresa (opcional)"
                                    maxLength={100}
                                />
                                {errors.empresa && (
                                    <span className={styles.formError}>{errors.empresa}</span>
                                )}
                            </div>
                        </div>

                        {/* Terceira linha - Assunto */}
                        <div className={styles.formGroup}>
                            <label htmlFor="assunto" className={styles.formLabel}>
                                Assunto *
                            </label>
                            <input
                                type="text"
                                id="assunto"
                                name="assunto"
                                value={formData.assunto}
                                onChange={handleChange}
                                className={`${styles.formInput} ${errors.assunto ? styles.formInputError : ''}`}
                                placeholder="Qual é o assunto da sua mensagem?"
                                maxLength={200}
                            />
                            {errors.assunto && (
                                <span className={styles.formError}>{errors.assunto}</span>
                            )}
                        </div>

                        {/* Quarta linha - Mensagem */}
                        <div className={styles.formGroup}>
                            <label htmlFor="mensagem" className={styles.formLabel}>
                                Mensagem *
                            </label>
                            <textarea
                                id="mensagem"
                                name="mensagem"
                                value={formData.mensagem}
                                onChange={handleChange}
                                className={`${styles.formTextarea} ${errors.mensagem ? styles.formInputError : ''}`}
                                placeholder="Descreva o seu projeto, necessidades ou questões..."
                                rows={5}
                                maxLength={2000}
                            />
                            {errors.mensagem && (
                                <span className={styles.formError}>{errors.mensagem}</span>
                            )}
                            <div className={styles.charCount}>
                                {formData.mensagem.length}/2000 caracteres
                            </div>
                        </div>

                        {/* Status Messages */}
                        {submitStatus === 'success' && (
                            <div className={styles.statusMessage + ' ' + styles.statusSuccess}>
                                ✅ Mensagem enviada com sucesso! Entrarei em contacto brevemente.
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className={styles.statusMessage + ' ' + styles.statusError}>
                                ❌ Erro ao enviar mensagem. Tenta novamente ou contacta-me directamente.
                            </div>
                        )}

                        {/* Botão Submit */}
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className={styles.spinner}></span>
                                    A enviar...
                                </>
                            ) : (
                                'Enviar Mensagem'
                            )}
                        </button>

                        <p className={styles.formNote}>
                            * Campos obrigatórios. Os seus dados serão tratados com total confidencialidade.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
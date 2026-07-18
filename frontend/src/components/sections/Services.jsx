// src/components/sections/Services.jsx
import React from 'react';
import styles from './Services.module.css';

const servicesData = [
    {
        id: 'desenvolvimento',
        icon: 'bi-code-slash',
        title: 'Desenvolvimento',
        tagline: 'Sites, aplicações web e mobile',
        tags: [
            'Sites estáticos',
            'Apps Web Fullstack',
            'Lojas WordPress/E-commerce',
            'Apps Mobile (Flutter/Dart)'
        ]
    },
    {
        id: 'design-multimedia',
        icon: 'bi-palette',
        title: 'Design & Multimédia',
        tagline: 'Identidade visual e produção audiovisual',
        tags: [
            'Logótipos',
            'Manuais de Identidade Visual',
            'Cartazes & Flyers',
            'Animação 2D/3D',
            'Edição de Vídeo'
        ]
    },
    {
        id: 'bases-de-dados',
        icon: 'bi-database',
        title: 'Bases de Dados',
        tagline: 'Estruturação de dados robusta',
        tags: [
            'Desenho de BD em SQL',
            'Desenho de BD em NoSQL (MongoDB)'
        ]
    },
    {
        id: 'outros-servicos',
        icon: 'bi-grid',
        title: 'Outros Serviços',
        tagline: 'Além do essencial',
        tags: [
            'Jogos 2D & Apps em Unity',
            'Prototipagem Web/Mobile',
            'Apps em C#',
            'Gestão de Redes Sociais',
            'Consultoria (Design, Multimédia & Programação)'
        ]
    }
];

const ServiceCard = ({ service, index }) => {
    return (
        <div
            className={styles.serviceCard}
            style={{ '--animation-delay': `${index * 0.15}s` }}
        >
            <div className={styles.serviceIconWrapper}>
                <i className={`bi ${service.icon}`}></i>
            </div>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceTagline}>{service.tagline}</p>
            <div className={styles.serviceTags}>
                {service.tags.map((tag, i) => (
                    <span key={i} className={styles.serviceTag}>{tag}</span>
                ))}
            </div>
        </div>
    );
};

const Services = () => {
    return (
        <section className={styles.services} id="services">
            <div className={styles.servicesContainer}>
                <div className={styles.servicesHeader}>
                    <div className={styles.servicesLabel}>Serviços</div>
                    <h2 className={styles.servicesTitle}>
                        O que posso fazer por ti
                    </h2>
                    <p className={styles.servicesSubtitle}>
                        Da conceção à entrega, um conjunto de serviços que cobre
                        todo o ciclo de um projeto digital.
                    </p>
                </div>

                <div className={styles.servicesGrid}>
                    {servicesData.map((service, index) => (
                        <ServiceCard key={service.id} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;

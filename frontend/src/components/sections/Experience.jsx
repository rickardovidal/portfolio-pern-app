import React from 'react';
import { motion } from 'framer-motion';
import styles from './Experience.module.css';

const experienceData = [
    {
        period: 'Fev 2026 - Jul 2026',
        title: 'Estágio curricular - Programador Full Stack',
        organization: 'Mediacenter, Viseu',
        description: 'Estágio de conclusão da licenciatura, com dois projetos conduzidos em paralelo e entregues dentro do prazo.',
        bullets: [
            'Livo.Space: desenvolvimento a solo, de ponta a ponta, de uma plataforma de gestão imobiliária hoje em produção. Frontend em React, API REST em Node.js e Express, base de dados PostgreSQL com Sequelize, autenticação JWT, upload de ficheiros (Cloudflare R2), notificações por email (Resend) e publicação em cPanel.',
            'Bloco de Notas: rebranding completo e website em WordPress e Elementor para um centro de explicações em Viseu. Projeto avaliado em 19 valores.'
        ]
    },
    {
        period: 'Desde Jul 2026',
        title: 'Programador Web Freelancer',
        organization: 'Trabalho independente, Oliveira de Frades e remoto',
        description: 'Desenvolvimento de websites para pequenos negócios em WordPress e em stack JavaScript, do levantamento de requisitos à publicação e SEO on-page.'
    },
    {
        period: '2014 - 2022',
        title: 'Operador de Produção',
        organization: 'Pereira & Ladeira',
        description: 'Oito anos em ambiente industrial na produção de tampos de cozinha: operação de máquinas CNC e de corte por jato de água, embalagem e aprovisionamento. Contexto orientado para rigor, cumprimento de prazos e trabalho de equipa.'
    },
    {
        period: '2023 - 2026',
        title: 'Licenciatura em Tecnologias e Design de Multimédia',
        organization: 'Instituto Politécnico de Viseu - Escola Superior de Tecnologia e Gestão de Viseu',
        description: 'Concluída em 2026 com média final de 18 valores. Formação prática e interdisciplinar que combina Ciências Informáticas, Design e Multimédia, com aprendizagem baseada em projeto e em metodologias ágeis.',
        bullets: [
            'Desenvolvimento web e full stack',
            'Bases de dados e modelação de dados',
            'Redes e serviços de comunicação',
            'Aplicações para dispositivos móveis',
            'Design de interação e UI/UX',
            'Computação gráfica e conteúdos 2D/3D',
            'Gestão de projetos multimédia'
        ]

    },
    {
        period: '2024',
        title: 'Formação Certificada - 10787 - Planeamento e gestão de projeto de UX/UI (50 horas)',
        organization: 'Instituto de Emprego e Formação Profissional',
        description: 'Desenvolvimento de competências em prototipagem de páginas web com foco na experiência de utilizador'
    },
    {
        period: '2023',
        title: 'Formação Certificada - 0444 - E-marketing - Tecnologias de informação e comunicação (50 horas)',
        organization: 'Instituto de Emprego e Formação Profissional',
        description: 'Desenvolvimento de competências avançadas em Marketing Digital'
    },
    {
        period: '2023',
        title: 'Formação Certificada - 9957 - Design de multimédia (50 horas)',
        organization: 'Cesae Digital',
        description: 'Formação Avançada em produção de produtos Multimédia'
    },
    {
        period: '2023',
        title: 'Formação Certificada - 10784 - Gestão da presença empresarial nas redes sociais (50 horas)',
        organization: 'Instituto de Emprego e Formação Profissional',
        description: 'Formação Avancada de gestão da presença empresarial nas redes sociais.'
    },
    {
        period: '2023',
        title: 'Formação Certificada - 7855 - Plano de negócio - criação de pequenos e médios negócios (50 horas)',
        organization: 'Instituto de Emprego e Formação Profissional',
        description: 'Formação inicial de criação de uma marca e sua divulgação'
    },
    {
        period: '2021',
        title: 'Formação Certificada - 0458 - Tecnologias de fotografia e vídeo (50 horas)',
        organization: 'Inweb Solutions',
        description: 'Um dos primeiros contactos com a captura de fotografia profissional e edição de vídeo.'
    },
    
];

// Animation variants
const itemVariants = {
    hidden: { 
        opacity: 0, 
        x: -20 
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
        }
    }
};

const bulletVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            delay: i * 0.05,
            ease: [0.25, 0.1, 0.25, 1]
        }
    })
};

const ExperienceItem = ({ experience, index }) => {
    return (
        <motion.div 
            className={styles.experienceItem}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            <div className={styles.experiencePeriod}>{experience.period}</div>
            <div className={styles.experienceTitle}>{experience.title}</div>
            <div className={styles.experienceOrg}>{experience.organization}</div>
            <div className={styles.experienceDesc}>{experience.description}</div>
            {experience.bullets && (
                <ul className={styles.experienceBullets}>
                    {experience.bullets.map((bullet, i) => (
                        <motion.li 
                            key={i}
                            variants={bulletVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            custom={i}
                        >
                            {bullet}
                        </motion.li>
                    ))}
                </ul>
            )}

        </motion.div>
    );
};

const Experience = () => {
    return (
        <section className={styles.experience} id="experience">
            <div className={styles.experienceContainer}>
                <motion.div 
                    className={styles.experienceLabel}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    Percurso
                </motion.div>
                <div className={styles.experienceContent}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        Experiência profissional e formação
                    </motion.h2>
                    <div className={styles.timeline}>
                        {experienceData.map((experience, index) => (
                            <ExperienceItem key={index} experience={experience} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
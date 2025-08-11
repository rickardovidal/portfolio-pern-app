import React from 'react';
import styles from './Experience.module.css';

const experienceData = [
    {
        period: '2023 — Presente',
        title: 'Licenciatura em Tecnologias e Design Multimédia',
        organization: 'Instituto Politécnico de Viseu — Escola Superior de Tecnologia e Gestão de Viseu',
        description: 'O ciclo de estudos da licenciatura em Tecnologias e Design de Multimédia (TDM) confere uma formação sólida. Através de uma metodologia prática e interdisciplinar que combina as áreas das Ciências Informáticas, Design e Multimédia, recorrendo a aprendizagem baseada em projeto. Licenciatura abrangente em desenvolvimento web, aplicações móveis, computação gráfica e gestão de projetos digitais e muito mais. Foco em tecnologias emergentes e metodologias ágeis de desenvolvimento.',
        bullets: [
            'Design de produtos multimédia',
            'Design Web',
            'Design de aplicações para dispositivos móveis',
            'Autoria de conteúdos multimédia, 2D e 3D',
            'Desenvolvimento de produtos multimédia',
            'Desenvolvimento Web',
            'Desenvolvimento de aplicações para dispositivos móveis',
            'Desenvolvimento de ambientes e animações 3D',
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
        title: 'Formação Certificada - 7855 - Plano de negócio – criação de pequenos e médios negócios (50 horas)',
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

const ExperienceItem = ({ experience }) => {
    return (
        <div className={styles.experienceItem}>
            <div className={styles.experiencePeriod}>{experience.period}</div>
            <div className={styles.experienceTitle}>{experience.title}</div>
            <div className={styles.experienceOrg}>{experience.organization}</div>
            <div className={styles.experienceDesc}>{experience.description}</div>
            {experience.bullets && (
                <ul className={styles.experienceBullets}>
                    {experience.bullets.map((bullet, i) => (
                        <li key={i}>{bullet}</li>
                    ))}
                </ul>
            )}

        </div>
    );
};

const Experience = () => {
    return (
        <section className={styles.experience} id="experience">
            <div className={styles.experienceContainer}>
                <div className={styles.experienceLabel}>Percurso</div>
                <div className={styles.experienceContent}>
                    <h2>Formação académica e desenvolvimento de competências</h2>
                    <div className={styles.timeline}>
                        {experienceData.map((experience, index) => (
                            <ExperienceItem key={index} experience={experience} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;
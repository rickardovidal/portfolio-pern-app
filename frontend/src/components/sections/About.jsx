import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const skillsData = [
    {
        title: 'Frontend',
        technologies: ['React', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'Bootstrap', 'React Router', 'Design responsivo']
    },
    {
        title: 'Backend',
        technologies: ['Node.js', 'Express', 'APIs REST', 'JWT', 'Sequelize', 'Arquitetura MVC']
    },
    {
        title: 'Base de dados',
        technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Modelação de dados']
    },
    {
        title: 'Deploy & Ferramentas',
        technologies: ['Git & GitHub', 'Vercel', 'Render', 'cPanel', 'Cloudflare R2', 'Resend']
    },
    {
        title: 'Design & UI/UX',
        technologies: ['Figma', 'Prototipagem', 'Identidade visual', 'Design de interação']
    },
    {
        title: 'Multimédia',
        technologies: ['Illustrator', 'Photoshop', 'InDesign', 'After Effects', 'Premiere Pro']
    }
];

const SkillItem = ({ skill }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={`${styles.skillItem} ${isExpanded ? styles.expanded : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <div className={styles.skillHeader}>
                {skill.title}
            </div>
            <div className={`${styles.skillDetails} ${isExpanded ? styles.expanded : ''}`}>
                <div className={styles.skillTech}>
                    {skill.technologies.map((tech, index) => (
                        <span key={index} className={styles.techTag}>
                            {tech}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const About = () => {
    return (
        <section className={styles.about} id="about">
            <div className={styles.aboutContainer}>
                <motion.div 
                    className={styles.aboutLabel}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    Sobre
                </motion.div>
                <div className={styles.aboutContent}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        Desenvolvimento web full stack, com o design incluído no processo
                    </motion.h2>
                    <div className={styles.aboutText}>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            Licenciado em Tecnologias e Design de Multimédia pela ESTGV (Instituto Politécnico de Viseu), com média final de 18 valores. O foco está no desenvolvimento web full stack: interfaces em React, APIs em Node.js e Express e bases de dados PostgreSQL, incluindo projetos já em produção.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            A formação junta ciências informáticas, design e multimédia, o que permite acompanhar um projeto de ponta a ponta: modelação de dados, desenvolvimento, interface, identidade visual e publicação. Cada solução é pensada para a necessidade real de quem a usa.
                        </motion.p>
                    </div>
                    <div className={styles.skillsList}>
                        {skillsData.map((skill, index) => (
                            <SkillItem key={index} skill={skill} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
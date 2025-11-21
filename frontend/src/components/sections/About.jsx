import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './About.module.css';

const skillsData = [
    {
        title: 'Web Development',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'APIs']
    },
    {
        title: 'UI/UX Design',
        technologies: ['Figma', 'Prototyping', 'User Research']
    },
    {
        title: 'Graphic Design',
        technologies: ['Adobe Illustrator', 'Adobe InDesign', 'Adobe Photoshop']
    },
    {
        title: 'Motion Design',
        technologies: ['Adobe After Effects', 'Adobe Premiere', 'Adobe Animate', 'Adobe Character Animator',]
    },
    {
        title: 'Database Management',
        technologies: ['PostgreSQL', 'SQL', 'Power Designer']
    },
    {
        title: 'Project Management',
        technologies: ['Trello', 'Git', 'Miro',]
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
                        Soluções digitais que combinam design e tecnologia
                    </motion.h2>
                    <div className={styles.aboutText}>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            O meu trabalho centra-se no desenvolvimento de projetos digitais que respondem a necessidades reais.
                            Combino competências em design e programação para criar desde interfaces web até aplicações, e outros produtos multimédia além do desenho e criação de bases de dados.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                            Com experiência em prototipagem, desenvolvimento web e full-stack, concepção de produtos de design gráfico e design multimédia e gestão de projetos. Procuro sempre a solução mais adequada para cada desafio.
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
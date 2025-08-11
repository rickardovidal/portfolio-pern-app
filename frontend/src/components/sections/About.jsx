import React, { useState } from 'react';
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
                <div className={styles.aboutLabel}>Sobre</div>
                <div className={styles.aboutContent}>
                    <h2>Soluções digitais que combinam design e tecnologia</h2>
                    <div className={styles.aboutText}>
                        <p>
                            O meu trabalho centra-se no desenvolvimento de projetos digitais que respondem a necessidades reais.
                            Combino competências em design e programação para criar desde interfaces web até aplicações, e outros produtos multimédia além do desenho e criação de bases de dados.
                        </p>
                        <p>
                            Com experiência em prototipagem, desenvolvimento web e full-stack, concepção de produtos de design gráfico e design multimédia e gestão de projetos. Procuro sempre a solução mais adequada para cada desafio.
                        </p>
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
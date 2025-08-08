import React, { useState } from 'react';
import styles from './About.module.css';

const skillsData = [
    {
        title: 'Web Development',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express']
    },
    {
        title: 'UI/UX Design',
        technologies: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research']
    },
    {
        title: 'Mobile Applications',
        technologies: ['Flutter', 'Dart', 'Firebase', 'React Native', 'APIs']
    },
    {
        title: '3D Graphics',
        technologies: ['Blender', 'Unity', 'OpenGL', '3D Modeling', 'Animation']
    },
    {
        title: 'Database Management',
        technologies: ['MongoDB', 'PostgreSQL', 'MySQL', 'NoSQL', 'SQL']
    },
    {
        title: 'Project Management',
        technologies: ['Agile', 'Scrum', 'Git', 'Trello', 'Jira']
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
                    <h2>Criando soluções digitais através da combinação de design e tecnologia</h2>
                    <div className={styles.aboutText}>
                        <p>
                            Atualmente no 3º ano de Tecnologias e Design Multimédia no Instituto Politécnico de Viseu, 
                            desenvolvo competências que abrangem desde a conceção visual até à implementação técnica de projetos digitais.
                        </p>
                        <p>
                            O meu percurso académico foca-se em áreas como desenvolvimento web avançado, aplicações móveis, 
                            computação gráfica e gestão de projetos, preparando-me para enfrentar os desafios do mercado digital atual.
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
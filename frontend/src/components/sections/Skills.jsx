// src/components/sections/Skills.jsx
import React from 'react';
import {
    SiHtml5,
    SiCss3,
    SiJavascript,
    SiNodedotjs,
    SiExpress,
    SiReact,
    SiBootstrap,
    SiTailwindcss,
    SiUnity,
    SiFigma,
    SiAdobeillustrator,
    SiAdobephotoshop,
    SiAdobeindesign,
    SiAdobepremierepro,
    SiAdobeaftereffects,
    SiPostgresql,
    SiMysql,
    SiMongodb,
    SiSequelize,
    SiJsonwebtokens,
    SiGit
} from 'react-icons/si';
import styles from './Skills.module.css';

const skillsData = [
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'Express.js', icon: SiExpress, color: '#000000' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    { name: 'Sequelize', icon: SiSequelize, color: '#52B0E7' },
    { name: 'JWT', icon: SiJsonwebtokens, color: '#000000' },
    { name: 'Git', icon: SiGit, color: '#F05032' },
    { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    { name: 'Illustrator', icon: SiAdobeillustrator, color: '#FF9A00' },
    { name: 'Photoshop', icon: SiAdobephotoshop, color: '#31A8FF' },
    { name: 'InDesign', icon: SiAdobeindesign, color: '#FF3366' },
    { name: 'After Effects', icon: SiAdobeaftereffects, color: '#9999FF' },
    { name: 'Premiere Pro', icon: SiAdobepremierepro, color: '#9999FF' },
    { name: 'Unity', icon: SiUnity, color: '#000000' },
    // Ícones duplicados para criar movimento contínuo
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'Express.js', icon: SiExpress, color: '#000000' },
    { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
];

// Componente individual de cada skill
const SkillIcon = ({ skill, index }) => {
    const IconComponent = skill.icon;
    
    return (
        <div 
            className={styles.skillItem}
            style={{
                '--skill-color': skill.color,
                '--animation-delay': `${index * 0.1}s`
            }}
        >
            <div className={styles.skillIconWrapper}>
                <IconComponent className={styles.skillIcon} />
            </div>
            <span className={styles.skillName}>{skill.name}</span>
        </div>
    );
};

const Skills = () => {
    return (
        <section className={styles.skills} id="skills">
            <div className={styles.skillsContainer}>
                <div className={styles.skillsHeader}>
                    <div className={styles.skillsLabel}>Competências</div>
                    <h2 className={styles.skillsTitle}>
                        Tecnologias e ferramentas com que trabalho
                    </h2>
                    <p className={styles.skillsSubtitle}>
                        Desde o desenvolvimento web até ao design multimédia, 
                        trabalho com as mais recentes tecnologias do mercado.
                    </p>
                </div>

                <div className={styles.skillsCarousel}>
                    <div className={styles.skillsTrack}>
                        {skillsData.map((skill, index) => (
                            <SkillIcon key={`${skill.name}-${index}`} skill={skill} index={index} />
                        ))}
                    </div>
                </div>

                <div className={styles.skillsCategories}>
                    <div className={styles.skillCategory}>
                        <h3>Desenvolvimento</h3>
                        <p>Frontend & Backend</p>
                    </div>
                    <div className={styles.skillCategory}>
                        <h3>Design</h3>
                        <p>UI/UX & Multimédia</p>
                    </div>
                    <div className={styles.skillCategory}>
                        <h3>Ferramentas</h3>
                        <p>Produtividade & Deploy</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;
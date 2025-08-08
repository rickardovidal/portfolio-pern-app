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
    //SiCsharp, 
    SiUnity, 
    SiFigma, 
    SiAdobeillustrator, 
    SiAdobephotoshop, 
    SiAdobeindesign, 
    SiAdobepremierepro, 
    SiAdobeaftereffects, 
    SiAdobelightroom,
    //SiVisualstudiocode, 
    //SiVisualstudio, 
    SiPostgresql, 
    SiVirtualbox,
    SiAdobecreativecloud
} from 'react-icons/si';
import styles from './Skills.module.css';

const skillsData = [
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'Express.js', icon: SiExpress, color: '#000000' },
    { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
    //{ name: 'C#', icon: SiCsharp, color: '#239120' },
    { name: 'Unity', icon: SiUnity, color: '#000000' },
    { name: 'Figma', icon: SiFigma, color: '#F24E1E' },
    { name: 'Illustrator', icon: SiAdobeillustrator, color: '#FF9A00' },
    { name: 'Photoshop', icon: SiAdobephotoshop, color: '#31A8FF' },
    { name: 'InDesign', icon: SiAdobeindesign, color: '#FF3366' },
    { name: 'Premiere Pro', icon: SiAdobepremierepro, color: '#9999FF' },
    { name: 'After Effects', icon: SiAdobeaftereffects, color: '#9999FF' },
    { name: 'Lightroom', icon: SiAdobelightroom, color: '#31A8FF' },
    //{ name: 'VS Code', icon: SiVisualstudiocode, color: '#007ACC' },
    //{ name: 'Visual Studio', icon: SiVisualstudio, color: '#5C2D91' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
    { name: 'VirtualBox', icon: SiVirtualbox, color: '#183A61' },
    // Adicionar alguns ícones duplicados para criar movimento contínuo
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'React', icon: SiReact, color: '#61DAFB' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
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
                        Tecnologias e ferramentas que domino
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
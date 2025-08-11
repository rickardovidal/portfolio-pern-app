// src/components/sections/Hero.jsx
import React from 'react';
import WorkMosaic from '../ui/WorkMosaic';
import styles from './Hero.module.css';

const Hero = () => {
    const handleSmoothScroll = (e) => {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <section className={styles.hero} id="home">
            <div className={styles.heroContainer}>
                <div className={styles.heroText}>
                    <h1 className={styles.heroTitle}>
                        Designer <strong>Multimédia</strong><br />& Desenvolvedor
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Crio soluções digitais completas, da ideia à execução, com foco em experiências intuitivas e funcionais.
                    </p>
                    <a
                        href="#projects"
                        className={styles.heroCta}
                        onClick={handleSmoothScroll}
                    >
                        Ver trabalhos
                    </a>
                </div>
                <div className={styles.heroMosaicWrapper}>
                    <WorkMosaic />
                </div>
            </div>
        </section>
    );
};

export default Hero;
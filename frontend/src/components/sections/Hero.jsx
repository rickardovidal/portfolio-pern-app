// src/components/sections/Hero.jsx
import React from 'react';
import { motion } from 'framer-motion';
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

    // Animation variants - subtle, professional
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 20 
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1] // Cubic bezier for smooth, professional feel
            }
        }
    };

    const mosaicVariants = {
        hidden: { 
            opacity: 0,
            y: 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.4
            }
        }
    };

    return (
        <section className={styles.hero} id="home">
            <div className={styles.heroContainer}>
                <motion.div 
                    className={styles.heroText}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1 
                        className={styles.heroTitle}
                        variants={itemVariants}
                    >
                        Designer <strong>Multimedia</strong><br />& Desenvolvedor
                    </motion.h1>
                    <motion.p 
                        className={styles.heroSubtitle}
                        variants={itemVariants}
                    >
                        Crio solucoes digitais completas, da ideia a execucao, com foco em experiencias intuitivas e funcionais.
                    </motion.p>
                    <motion.a
                        href="#projects"
                        className={styles.heroCta}
                        onClick={handleSmoothScroll}
                        variants={itemVariants}
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                    >
                        Ver trabalhos
                        <span className={styles.ctaArrow}>→</span>
                    </motion.a>
                </motion.div>
                <motion.div 
                    className={styles.heroMosaicWrapper}
                    variants={mosaicVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <WorkMosaic />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

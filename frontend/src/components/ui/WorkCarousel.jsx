// src/components/ui/WorkMosaic.jsx
import React from 'react';
import { showcaseWorks, projectsData } from '../../data/portfolioData';
import styles from './WorkMosaic.module.css';

const WorkMosaic = () => {
    // Selecionar os melhores trabalhos para o mosaico (otimizado para visibilidade)
    const mosaicItems = [
        ...showcaseWorks,
        ...projectsData.filter(project => 
            project.featured && 
            !showcaseWorks.find(show => show.id === project.id)
        )
    ].slice(0, 12); // Reduzido para 12 items para melhor visibilidade

    const handleItemClick = (item) => {
        // Determinar a ação baseada no tipo de trabalho
        if (item.type === 'prototype' && (item.link || item.figmaLink)) {
            window.open(item.link || item.figmaLink, '_blank');
        } else if (item.type === 'web' && item.externalLink) {
            window.open(item.externalLink, '_blank');
        } else {
            // Para outros tipos, podemos implementar um modal ou redirecionar para a secção projects
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const getItemSize = (index, item) => {
        // Padrão otimizado para garantir boa distribuição visual
        const patterns = [
            'large', 'medium', 'small', 'wide',
            'small', 'tall', 'medium', 'small',
            'wide', 'small', 'medium', 'large'
        ];
        return patterns[index % patterns.length];
    };

    const getMediaElement = (item) => {
        if (item.type === 'video') {
            return (
                <div className={styles.videoWrapper}>
                    <img
                        src={item.poster || item.thumbnail}
                        alt={item.title}
                        className={styles.mosaicImage}
                    />
                    <div className={styles.playOverlay}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
            );
        }

        return (
            <img
                src={item.media || item.thumbnail}
                alt={item.title}
                className={styles.mosaicImage}
            />
        );
    };

    return (
        <div className={styles.heroMosaic}>
            <div className={styles.mosaicGrid}>
                {mosaicItems.map((item, index) => (
                    <div
                        key={`${item.id}-${index}`}
                        className={`${styles.mosaicItem} ${styles[getItemSize(index, item)]}`}
                        onClick={() => handleItemClick(item)}
                        data-type={item.type}
                    >
                        {getMediaElement(item)}
                        
                        {/* Glassmorphism overlay com informações */}
                        <div className={styles.mosaicOverlay}>
                            <div className={styles.overlayContent}>
                                <span className={styles.itemCategory}>{item.category}</span>
                                <h4 className={styles.itemTitle}>{item.title}</h4>
                            </div>
                        </div>

                        {/* Indicador do tipo de conteúdo */}
                        <div className={styles.typeIndicator}>
                            {item.type === 'video' && (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            )}
                            {item.type === 'web' && (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                                </svg>
                            )}
                            {item.type === 'prototype' && (
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Gradiente decorativo para integração */}
            <div className={styles.mosaicGradient}></div>
        </div>
    );
};

export default WorkMosaic;
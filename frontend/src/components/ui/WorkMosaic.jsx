// src/components/ui/WorkMosaic.jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { showcaseWorks, projectsData } from '../../data/portfolioData';
import ProjectModal from './ProjectModal';
import VideoModal from './VideoModal';
import styles from './WorkMosaic.module.css';

const WorkMosaic = () => {
    const [columns, setColumns] = useState(4);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const containerRef = useRef(null);

    // CORREÇÃO: Breakpoints específicos para corresponder ao Hero otimizado
    useEffect(() => {
        const updateColumns = () => {
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                
                // Breakpoints ajustados para corresponder ao Hero
                if (width < 480) {
                    setColumns(1);
                } else if (width < 600) {
                    setColumns(2);
                } else if (width < 900) {
                    setColumns(3); // Tablet - layout vertical no Hero
                } else if (width < 1026) {
                    setColumns(3); // Tablet grande
                } else if (width < 1205) {
                    setColumns(4); // Desktop médio - faixa problemática 1
                } else if (width < 1276) {
                    setColumns(4); // Desktop médio - faixa problemática 2
                } else {
                    setColumns(4); // Desktop grande
                }
            }
        };

        updateColumns();
        window.addEventListener('resize', updateColumns);
        return () => window.removeEventListener('resize', updateColumns);
    }, []);

    // Distribuir items pelas colunas (algoritmo Masonry)
    const distributeItems = () => {
        const columnHeights = new Array(columns).fill(0);
        const itemsByColumn = Array.from({ length: columns }, () => []);

        showcaseWorks.forEach((item, index) => {
            // Encontrar coluna com menor altura
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            
            // Adicionar item à coluna
            itemsByColumn[shortestColumn].push({ ...item, index });
            
            // Estimar altura baseada no aspect ratio
            const [width, height] = item.aspectRatio.split(':').map(Number);
            const estimatedHeight = (height / width) * 100; // altura relativa
            columnHeights[shortestColumn] += estimatedHeight + 10; // +10 para gap
        });

        return itemsByColumn;
    };

    const handleItemClick = (item) => {
        // Buscar dados completos do projeto se necessário
        const fullProjectData = projectsData.find(p => p.id === item.id) || item;
        
        // Determinar ação baseada no tipo e propriedades
        if (item.action === 'external' || (item.type === 'web' && item.link)) {
            // Sites e protótipos com links externos
            window.open(item.link || item.externalLink, '_blank');
        } else if (item.type === 'video' || item.action === 'video') {
            // Vídeos abrem modal de vídeo
            setSelectedProject(fullProjectData);
            setModalType('video');
            setIsModalOpen(true);
        } else if (item.type === 'image' || item.action === 'modal') {
            // Imagens e projetos com galeria abrem modal
            setSelectedProject(fullProjectData);
            setModalType('gallery');
            setIsModalOpen(true);
        } else if (item.type === 'prototype' && item.link) {
            // Protótipos sem ação específica vão para link
            window.open(item.link, '_blank');
        } else {
            // Fallback: scroll para projetos
            const projectsSection = document.querySelector('#projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
        setModalType(null);
    };

    const getMediaElement = (item) => {
        if (item.type === 'video') {
            return (
                <div className={styles.mediaWrapper}>
                    <video
                        className={styles.mosaicMedia}
                        poster={item.poster}
                        muted
                        loop
                        playsInline
                        onMouseEnter={(e) => e.target.play()}
                        onMouseLeave={(e) => e.target.pause()}
                    >
                        <source src={item.media} type="video/mp4" />
                    </video>
                    <div className={styles.playIndicator}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                </div>
            );
        }
        
        return (
            <img 
                src={item.thumbnail || item.media} 
                alt={item.title}
                className={styles.mosaicMedia}
                loading="lazy"
            />
        );
    };


    // Animation variants for mosaic items
    const itemVariants = {
        hidden: { 
            opacity: 0, 
            y: 15,
            scale: 0.98
        },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1]
            }
        })
    };

    const itemsByColumn = distributeItems();

    return (
        <>
            <div className={styles.mosaicContainer} ref={containerRef}>
                <div 
                    className={styles.mosaicGrid} 
                    style={{ '--columns': columns }}
                >
                    {itemsByColumn.map((columnItems, colIndex) => (
                        <div key={colIndex} className={styles.mosaicColumn}>
                            {columnItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    className={styles.mosaicItem}
                                    onClick={() => handleItemClick(item)}
                                    data-type={item.type}
                                    data-aspect-ratio={item.aspectRatio}
                                    style={{
                                        '--aspect-ratio': item.aspectRatio.replace(':', '/'),
                                        '--animation-delay': `${item.index * 0.1}s`
                                    }}
                                >
                                    {getMediaElement(item)}
                                    
                                    {/* Overlay com glassmorphism */}
                                    <div className={styles.itemOverlay}>
                                        <div className={styles.overlayContent}>
                                            <span className={styles.itemCategory}>
                                                {item.category}
                                            </span>
                                            <h4 className={styles.itemTitle}>
                                                {item.title}
                                            </h4>
                                        </div>
                                    </div>

                                    {/* Indicador de tipo */}
                                    <div className={styles.typeIndicator}>
                                        {item.type === 'video' && (
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                        )}
                                        {item.type === 'prototype' && (
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                            </svg>
                                        )}
                                        {(item.type === 'web' || item.link) && (
                                            <svg viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
                                            </svg>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Modals */}
            {modalType === 'gallery' && (
                <ProjectModal
                    project={selectedProject}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
            {modalType === 'video' && (
                <VideoModal
                    project={selectedProject}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default WorkMosaic;


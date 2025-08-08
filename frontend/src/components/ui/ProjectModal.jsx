// src/components/ui/ProjectModal.jsx
import React, { useState, useEffect } from 'react';
import styles from './ProjectModal.module.css';

const ProjectModal = ({ project, isOpen, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            previousImage();
        }
    };

    const nextImage = () => {
        if (project?.gallery) {
            setCurrentImageIndex((prev) => 
                prev === project.gallery.length - 1 ? 0 : prev + 1
            );
        }
    };

    const previousImage = () => {
        if (project?.gallery) {
            setCurrentImageIndex((prev) => 
                prev === 0 ? project.gallery.length - 1 : prev - 1
            );
        }
    };

    const goToImage = (index) => {
        setCurrentImageIndex(index);
    };

    if (!isOpen || !project) return null;

    return (
        <div 
            className={styles.modalOverlay} 
            onClick={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* Cabeçalho */}
                <div className={styles.modalHeader}>
                    <div>
                        <h2 className={styles.modalTitle}>{project.title}</h2>
                        <p className={styles.modalCategory}>{project.category}</p>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                {/* Galeria principal */}
                <div className={styles.imageContainer}>
                    {project.gallery && project.gallery.length > 0 && (
                        <>
                            <img
                                src={project.gallery[currentImageIndex]}
                                alt={`${project.title} - ${currentImageIndex + 1}`}
                                className={styles.mainImage}
                            />
                            
                            {/* Controlos de navegação */}
                            {project.gallery.length > 1 && (
                                <>
                                    <button 
                                        className={`${styles.navButton} ${styles.prevButton}`}
                                        onClick={previousImage}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
                                        </svg>
                                    </button>
                                    
                                    <button 
                                        className={`${styles.navButton} ${styles.nextButton}`}
                                        onClick={nextImage}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
                                        </svg>
                                    </button>
                                </>
                            )}

                            {/* Indicador da imagem atual */}
                            <div className={styles.imageCounter}>
                                {currentImageIndex + 1} / {project.gallery.length}
                            </div>
                        </>
                    )}
                </div>

                {/* Miniaturas */}
                {project.gallery && project.gallery.length > 1 && (
                    <div className={styles.thumbnailContainer}>
                        {project.gallery.map((image, index) => (
                            <button
                                key={index}
                                className={`${styles.thumbnail} ${
                                    index === currentImageIndex ? styles.activeThumbnail : ''
                                }`}
                                onClick={() => goToImage(index)}
                            >
                                <img src={image} alt={`Thumbnail ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                )}

                {/* Informações do projeto */}
                <div className={styles.projectInfo}>
                    <p className={styles.description}>{project.description}</p>
                    {project.technologies && (
                        <div className={styles.technologies}>
                            <span className={styles.techLabel}>Tecnologias:</span>
                            <div className={styles.techList}>
                                {project.technologies.map((tech, index) => (
                                    <span key={index} className={styles.techTag}>
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;
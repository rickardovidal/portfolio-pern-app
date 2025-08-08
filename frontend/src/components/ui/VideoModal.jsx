// src/components/ui/VideoModal.jsx
import React, { useEffect, useRef } from 'react';
import styles from './VideoModal.module.css';

const VideoModal = ({ project, isOpen, onClose }) => {
    const videoRef = useRef(null);

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

    useEffect(() => {
        // Pausar vídeo quando modal fecha
        if (!isOpen && videoRef.current) {
            videoRef.current.pause();
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    // CORREÇÃO: Função para lidar com cliques no overlay
    const handleOverlayClick = (e) => {
        // Verificar se o clique foi no overlay e não no vídeo ou seus controlos
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !project) return null;

    return (
        <div 
            className={styles.modalOverlay} 
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
                {/* Cabeçalho */}
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}> {/* Adicionado para alinhamento */}
                        <h2 className={styles.modalTitle}>{project.title}</h2>
                        <p className={styles.modalCategory}>{project.category}</p>
                    </div>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>

                {/* Container do vídeo */}
                <div className={styles.videoContainer}>
                    <video
                        ref={videoRef}
                        className={styles.video}
                        controls
                        controlsList="nodownload"
                        autoPlay
                        poster={project.poster}
                        onError={(e) => console.error('Erro ao carregar vídeo:', e)}
                        onLoadedData={() => console.log('Vídeo carregado com sucesso')}
                        // CORREÇÃO: Impedir que cliques no vídeo fechem o modal
                        onClick={(e) => e.stopPropagation()}
                    >
                        <source src={project.video || project.media} type="video/mp4" />
                        <source src={project.video || project.media} type="video/webm" />
                        O seu navegador não suporta o elemento vídeo.
                    </video>
                    {/* Debug temporário */}
                    {console.log('Caminho do vídeo:', project.video || project.media)}
                    {console.log('Dados do projeto:', project)}
                </div>

                {/* Informações do projeto */}
                {(project.description || project.technologies) && (
                    <div className={styles.projectInfo}>
                        <div className={styles.infoContent}> {/* Adicionado para alinhamento */}
                            {project.description && (
                                <p className={styles.description}>{project.description}</p>
                            )}
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
                )}
            </div>
        </div>
    );
};

export default VideoModal;


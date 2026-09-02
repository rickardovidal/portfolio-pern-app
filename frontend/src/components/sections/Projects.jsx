import React, { useState, useMemo } from 'react';
import ProjectModal from '../ui/ProjectModal'; // IMPORTAR MODAL
import VideoModal from '../ui/VideoModal'; // IMPORTAR MODAL DE VÍDEO
import styles from './Projects.module.css';

const blocoNotasManualPages = Array.from({ length: 30 }, (_, i) =>
    `/portfolio/design/manual-bloco-notas/page-${String(i + 1).padStart(2, '0')}.jpg`
);

const blocoLabManualPages = Array.from({ length: 32 }, (_, i) =>
    `/portfolio/design/manual-bloco-lab/page-${String(i + 1).padStart(2, '0')}.jpg`
);

const projectsData = [
    {
        id: 20,
        title: 'Livo.Space - Plataforma de gestão imobiliária',
        description: 'Plataforma de gestão imobiliária em cloud, desenvolvida de raiz e a solo a pedido da Mediacenter, hoje em produção. Áreas autenticadas por perfil (proprietários, inquilinos e gestão), API REST própria, upload de ficheiros e notificações por email.',
        technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'JWT', 'Cloudflare R2', 'Resend'],
        category: 'web',
        placeholder: 'Plataforma SaaS',
        thumbnail: '/portfolio/web/livospace-thumb.jpg',
        thumbnailFit: 'contain',
        link: 'https://livospace.gorgeouslevel.pt/',
        featured: true
    },
    {
        id: 21,
        title: 'byrvidal.digital - Portefólio em aplicação PERN',
        description: 'Este site: aplicação full stack com área pública e painel de gestão autenticado (projetos, clientes, serviços, faturas e documentos), API REST própria, dashboard com estatísticas e formulário de contacto com envio de email.',
        technologies: ['React', 'Vite', 'Node.js', 'Express', 'PostgreSQL', 'Sequelize', 'JWT', 'Bootstrap'],
        category: 'web',
        placeholder: 'Aplicação PERN',
        thumbnail: '/portfolio/web/byrvidal-thumb.jpg',
        link: 'https://github.com/rickardovidal/portfolio-pern-app',
        featured: true
    },
    {
        id: 15,
        title: 'Pata Azul - site para clínica veterinária',
        description: 'Site de demonstração de serviço: React + Tailwind, com sistema de marca e identidade visual próprios, formulário de contacto funcional, consentimento de cookies e animações de scroll. Pensado como modelo replicável para negócio de veterinária/pet care.',
        technologies: ['React', 'Tailwind CSS'],
        category: 'web',
        placeholder: 'Veterinary Clinic Website',
        thumbnail: '/portfolio/web/pata-azul-thumb.png',
        thumbnailFit: 'contain',
        link: 'https://pataazul.netlify.app/',
        featured: true
    },
    {
        id: 3,
        title: 'Site EUNICE - Assembleia Geral Europeia',
        description: 'Website institucional para evento da EUNICE (assembleia de politécnicos europeus), desenvolvido em equipa de três. Interface responsiva com programa, indicações de como viajar para o local e principais pontos de interesse de Viseu.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
        category: 'web',
        placeholder: 'Event Website',
        thumbnail: '/portfolio/web/eunice-site-thumb.jpg',
        link: 'https://euniceipv.github.io/ga/',
        featured: false
    },
    {
        id: 6,
        title: 'Portfolio Unity - Projetos Interativos',
        description: 'Website dedicado aos projetos Unity com showcase interativo, demonstrações jogáveis em WebGL e documentação técnica completa.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
        category: 'web',
        placeholder: 'Unity Portfolio',
        thumbnail: '/portfolio/web/portfolio-unity-thumb.jpg',
        thumbnailFit: 'contain',
        link: 'http://193.137.7.33/~aluno28368/Portfolio/',
        featured: false
    },
    {
        id: 22,
        title: 'Bloco de Notas - Identidade e Website (estágio)',
        description: 'Projeto de estágio na Mediacenter para o Bloco de Notas, centro de explicações em Viseu: rebranding completo (identidade visual, logótipo, sistema cromático e tipográfico) e website em WordPress e Elementor. Avaliado em 19 valores.',
        technologies: ['WordPress', 'Elementor', 'Illustrator', 'Photoshop', 'InDesign'],
        category: 'design',
        placeholder: 'Rebranding + Website',
        thumbnail: '/portfolio/design/manual-bloco-notas-thumb.jpg',
        thumbnailFit: 'contain',
        gallery: blocoNotasManualPages,
        action: 'modal',
        link: '#projects',
        featured: true
    },
    {
        id: 4,
        title: 'App Eventos Viseu - Protótipo',
        description: 'Aplicação móvel para divulgação de eventos em Viseu. Interface intuitiva com filtros, favoritos e notificações personalizadas.',
        technologies: ['Figma', 'UI Design', 'UX Research', 'Prototyping'],
        category: 'mobile',
        placeholder: 'Mobile App Prototype',
        thumbnail: '/portfolio/prototypes/eventos-thumb.jpg',
        link: 'https://www.figma.com/proto/FePjZVtIrcIfa3pU84DIWd/Proj--3',
        featured: true
    },
    {
        id: 5,
        title: 'Protótipo EUNICE - Interface de Evento',
        description: 'Protótipo completo para website de divulgação da Assembleia Geral da EUNICE. Inclui wireframes, design system e fluxos de navegação.',
        technologies: ['Figma', 'Design System', 'Wireframing', 'User Journey'],
        category: 'mobile',
        placeholder: 'UI/UX Prototype',
        thumbnail: '/portfolio/prototypes/eunice-prototype-thumb.jpg',
        link: 'https://www.figma.com/proto/TCOYCKof5aw98y6RBcXDhI/Prototipo_Projeto_Integrado_II_23_01_25?page-id=46%3A3&node-id=1036-8600&viewport=-1349%2C356%2C0.09&t=QSh7QjVw79Pd90Tx-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=51%3A9',
        featured: false
    },
    {
        id: 8,
        title: 'Identidade Visual - Pizzaria Lugar do Castelo',
        description: 'Sistema completo de identidade visual para pizzaria. Desenvolvimento de logótipo, papelaria corporativa, embalagens e sinalética.',
        technologies: ['Illustrator', 'Photoshop', 'InDesign', 'Branding'],
        category: 'design',
        placeholder: 'Brand Identity',
        thumbnail: '/portfolio/design/pizzaria-thumb.jpeg',
        gallery: [
            '/portfolio/design/pizzaria/estacionario.jpg',
            '/portfolio/design/pizzaria/lacre.jpg',
            '/portfolio/design/pizzaria/avental.jpg',
            '/portfolio/design/pizzaria/caixa-pizza.jpg',
            '/portfolio/design/pizzaria/tabuleta.jpg',
            '/portfolio/design/pizzaria/estabelecimento.jpg',
            '/portfolio/design/pizzaria/logo3d.jpg',
            '/portfolio/design/pizzaria/lousa.jpg',
        ],
        action: 'modal', // Para abrir modal com galeria
        link: '#projects',
        featured: true
    },
    {
        id: 9,
        title: 'Motion Design - Foguetão Espacial',
        description: 'Animação 2D em After Effects explorando movimento e timing. Elementos dinâmicos com transições.',
        technologies: ['After Effects', 'Illustrator', 'Motion Graphics'],
        category: 'motion',
        placeholder: 'Animation Video',
        thumbnail: '/portfolio/motion/foguetao-thumb.jpg',
        video: '/portfolio/motion/fogetao.mp4',
        poster: '/portfolio/motion/foguetao-poster.jpg',
        action: 'video', // Para abrir modal de vídeo
        link: '#projects',
        featured: true
    },
    {
        id: 10,
        title: 'Stop Motion - Abecedário da Vida Académica',
        description: 'Animação stop motion integrada no projeto educativo. Produção com técnica cutout explorando a experiência universitária.',
        technologies: ['StopMotion Studio', 'Adobe Premiere Pro', 'Cutout Animation'],
        category: 'motion',
        placeholder: 'Stop Motion',
        thumbnail: '/portfolio/motion/abecedario-thumb.jpg',
        video: '/portfolio/motion/abecedario-stopmotion.mp4',
        action: 'video',
        link: '#projects',
        featured: false
    },
    {
        id: 11,
        title: 'Motion Graphics - Adidas Brand',
        description: 'Animação promocional inspirada na identidade Adidas. Exploração de movimento de marca com transições dinâmicas.',
        technologies: ['After Effects', 'Illustrator', 'Brand Animation'],
        category: 'motion',
        placeholder: 'Brand Animation',
        thumbnail: '/portfolio/motion/adidasanim.jpg',
        video: '/portfolio/motion/adidasanim.mp4',
        poster: '/portfolio/motion/adidasanim-poster.jpg',
        action: 'video',
        link: '#projects',
        featured: false
    },
    {
        id: 12,
        title: 'Curta-Metragem "My Brother"',
        description: 'Curta-metragem experimental. Trabalho completo de edição, color grading e pós-produção.',
        technologies: ['Premiere Pro', 'After Effects', 'Color Grading'],
        category: 'motion',
        placeholder: 'Short Film',
        thumbnail: '/portfolio/video/mybrother-thumb.jpg',
        video: '/portfolio/video/mybrother.mp4',
        poster: '/portfolio/video/mybrother-poster.jpg',
        action: 'video',
        link: '#projects',
        featured: true
    },
    {
        id: 13,
        title: 'Book Fotográfico - Composição e Técnica',
        description: 'Exploração artística através da fotografia, focando técnicas de composição, jogo de luzes, sombras e movimento com visão criativa.',
        technologies: ['Adobe Lightroom', 'Fotografia Digital', 'Composição'],
        category: 'design',
        placeholder: 'Photography Book',
        thumbnail: '/portfolio/design/book-fotografia-thumb.jpg',
        link: 'https://www.behance.net/gallery/195288761/Book-Composicao-e-Fotografia',
        featured: false
    },
    {
        id: 14,
        title: 'Cartaz Dia Mundial do Origami',
        description: 'Cartaz promocional celebrando o Dia Mundial do Origami. Exploração de formas geométricas e teoria das cores com design contemporâneo.',
        technologies: ['Illustrator', 'Photoshop', 'Design Editorial'],
        category: 'design',
        placeholder: 'Event Poster',
        thumbnail: '/portfolio/design/origami-thumb.jpeg',
        gallery: ['/portfolio/design/origami-cartaz.jpeg'],
        action: 'modal',
        link: '#projects',
        featured: false
    },
    {
        id: 16,
        title: 'Cartaz Promocional - Bloco de Notas & Bloco Lab',
        description: 'Cartaz promocional do projeto dual-brand Bloco de Notas / Bloco Lab, desenhado em Figma. Destaca a identidade das duas marcas através de mockups desktop e mobile das plataformas.',
        technologies: ['Figma', 'Photoshop'],
        category: 'design',
        placeholder: 'Promotional Poster',
        thumbnail: '/portfolio/design/cartaz-dualbrand-thumb.png',
        thumbnailFit: 'contain',
        gallery: ['/portfolio/design/cartaz-dualbrand.png'],
        action: 'modal',
        link: '#projects',
        featured: false
    },
    {
        id: 17,
        title: 'Vídeo Demonstração - Bloco de Notas & Bloco Lab',
        description: 'Vídeo de demonstração do projeto dual-brand Bloco de Notas / Bloco Lab, com animações de scroll sobre mockups, motion graphics e transições produzidas em After Effects, e montagem final em Premiere Pro.',
        technologies: ['After Effects', 'Premiere Pro', 'Photoshop'],
        category: 'motion',
        placeholder: 'Demo Video',
        thumbnail: '/portfolio/motion/video-dualbrand-thumb.jpg',
        thumbnailFit: 'contain',
        video: '/portfolio/motion/video-dualbrand.mp4',
        poster: '/portfolio/motion/video-dualbrand-poster.jpg',
        action: 'video',
        link: '#projects',
        featured: false
    },
    {
        id: 18,
        title: 'Manual de Identidade Visual - Bloco de Notas',
        description: 'Manual de identidade visual do redesign da marca Bloco de Notas, produzido em InDesign. Documenta o logótipo, a paleta restrita (verde esmeralda, navy e branco), a tipografia Inter e as normas de aplicação da marca.',
        technologies: ['InDesign', 'Branding', 'Design Editorial'],
        category: 'design',
        placeholder: 'Brand Manual',
        thumbnail: '/portfolio/design/manual-bloco-notas-thumb.jpg',
        thumbnailFit: 'contain',
        gallery: blocoNotasManualPages,
        action: 'modal',
        link: '#projects',
        featured: false
    },
    {
        id: 19,
        title: 'Manual de Identidade Visual - Bloco Lab',
        description: 'Manual de identidade visual da marca Bloco Lab, criada de raiz, produzido em InDesign. Documenta o logótipo, a paleta violeta e laranja âmbar, o sistema tipográfico (Space Grotesk, Inter e Epilogue) e as mascotes Robot e Codey.',
        technologies: ['InDesign', 'Branding', 'Design Editorial'],
        category: 'design',
        placeholder: 'Brand Manual',
        thumbnail: '/portfolio/design/manual-bloco-lab-thumb.jpg',
        thumbnailFit: 'contain',
        gallery: blocoLabManualPages,
        action: 'modal',
        link: '#projects',
        featured: false
    }
];

const categories = [
    { id: 'all', name: 'Todos os Projetos', count: projectsData.length },
    { id: 'web', name: 'Web', count: projectsData.filter(p => p.category === 'web').length },
    { id: 'mobile', name: 'Mobile/UI', count: projectsData.filter(p => p.category === 'mobile').length },
    { id: '3d', name: 'Unity/Jogos', count: projectsData.filter(p => p.category === '3d').length },
    { id: 'motion', name: 'Motion Design', count: projectsData.filter(p => p.category === 'motion').length },
    { id: 'design', name: 'Design Gráfico', count: projectsData.filter(p => p.category === 'design').length }
]
    .filter(category => category.count > 0)
    .sort((a, b) => b.count - a.count);

const ProjectCard = ({ project, index, onProjectClick }) => {
    const handleClick = (e) => {
        e.preventDefault();
        onProjectClick(project);
    };

    // Se não tem action, é link externo normal
    if (!project.action || project.action === 'external') {
        return (
            <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.projectItem}
                style={{
                    animationDelay: `${index * 0.1}s`
                }}
            >
                <div className={styles.projectImage}>
                    {project.thumbnail ? (
                        <img
                            src={project.thumbnail}
                            alt={project.title}
                            className={`${styles.projectThumbnail} ${project.thumbnailFit === 'contain' ? styles.projectThumbnailContain : ''}`}
                        />
                    ) : (
                        <div className={styles.projectPlaceholder}>
                            {project.placeholder}
                        </div>
                    )}
                    {project.featured && (
                        <div className={styles.featuredBadge}>
                            Destaque
                        </div>
                    )}
                </div>
                <div className={styles.projectInfo}>
                    <h3>{project.title}</h3>
                    <p className={styles.projectDescription}>
                        {project.description}
                    </p>
                    <div className={styles.projectMeta}>
                        <p className={styles.projectTech}>
                            {project.technologies.join(', ')}
                        </p>
                        <span className={styles.categoryTag}>
                            {categories.find(cat => cat.id === project.category)?.name || project.category}
                        </span>
                    </div>
                </div>
            </a>
        );
    }

    // Se tem action 'modal' ou 'video', usar onClick
    return (
        <div 
            className={styles.projectItem}
            style={{
                animationDelay: `${index * 0.1}s`
            }}
            onClick={handleClick}
        >
            <div className={styles.projectImage}>
                {project.thumbnail ? (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className={`${styles.projectThumbnail} ${project.thumbnailFit === 'contain' ? styles.projectThumbnailContain : ''}`}
                    />
                ) : (
                    <div className={styles.projectPlaceholder}>
                        {project.placeholder}
                    </div>
                )}
                {project.featured && (
                    <div className={styles.featuredBadge}>
                        Destaque
                    </div>
                )}
            </div>
            <div className={styles.projectInfo}>
                <h3>{project.title}</h3>
                <p className={styles.projectDescription}>
                    {project.description}
                </p>
                <div className={styles.projectMeta}>
                    <p className={styles.projectTech}>
                        {project.technologies.join(', ')}
                    </p>
                    <span className={styles.categoryTag}>
                        {categories.find(cat => cat.id === project.category)?.name || project.category}
                    </span>
                </div>
            </div>
        </div>
    );
};

const Projects = () => {
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    
    // NOVO: Estados para modais
    const [selectedProject, setSelectedProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    // Filtrar projetos por categoria
    const filteredProjects = useMemo(() => {
        if (selectedCategory === 'all') {
            return projectsData;
        }
        return projectsData.filter(project => project.category === selectedCategory);
    }, [selectedCategory]);

    // Projetos visíveis baseados no count
    const visibleProjects = filteredProjects.slice(0, visibleCount);
    const hasMoreProjects = visibleCount < filteredProjects.length;

    // NOVO: Função para lidar com cliques em projetos
    const handleProjectClick = (project) => {
        if (project.action === 'modal') {
            // Modal de galeria
            setSelectedProject(project);
            setModalType('gallery');
            setIsModalOpen(true);
        } else if (project.action === 'video') {
            // Modal de vídeo
            setSelectedProject(project);
            setModalType('video');
            setIsModalOpen(true);
        } else {
            // Link externo (fallback)
            if (project.link && project.link !== '#projects') {
                window.open(project.link, '_blank');
            }
        }
    };

    // NOVO: Fechar modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
        setModalType(null);
    };

    const handleLoadMore = async () => {
        setIsLoading(true);
        
        // Simular loading para melhor UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setVisibleCount(prev => Math.min(prev + 6, filteredProjects.length));
        setIsLoading(false);
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setVisibleCount(6); // Reset para mostrar os primeiros 6 da nova categoria
    };

    return (
        <section className={styles.projects} id="projects">
            <div className={styles.projectsContainer}>
                <div className={styles.projectsHeader}>
                    <div className={styles.projectsLabel}>Projetos Selecionados</div>
                </div>

                {/* Filtros Subtis */}
                <div className={styles.filtersContainer}>
                    <div className={styles.filters}>
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryChange(category.id)}
                                className={`${styles.filterButton} ${
                                    selectedCategory === category.id ? styles.active : ''
                                }`}
                            >
                                {category.name}
                                <span className={styles.filterCount}>
                                    {category.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid de Projetos */}
                <div className={styles.projectsGrid}>
                    {visibleProjects.map((project, index) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            index={index}
                            onProjectClick={handleProjectClick}
                        />
                    ))}
                </div>

                {/* Botão Ver Mais */}
                {hasMoreProjects && (
                    <div className={styles.loadMoreContainer}>
                        <button 
                            onClick={handleLoadMore}
                            disabled={isLoading}
                            className={styles.loadMoreButton}
                        >
                            {isLoading ? (
                                <>
                                    <div className={styles.spinner}></div>
                                    A carregar...
                                </>
                            ) : (
                                <>
                                    Ver Mais Projetos
                                    <span className={styles.remainingCount}>
                                        (+{filteredProjects.length - visibleCount})
                                    </span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Contador de Projetos */}
                <div className={styles.projectCounter}>
                    A mostrar {visibleProjects.length} de {filteredProjects.length} projetos
                    {selectedCategory !== 'all' && (
                        <span className={styles.categoryInfo}>
                            na categoria {categories.find(cat => cat.id === selectedCategory)?.name}
                        </span>
                    )}
                </div>
            </div>

            {/* NOVO: Modais */}
            {isModalOpen && selectedProject && modalType === 'gallery' && (
                <ProjectModal
                    project={selectedProject}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}

            {isModalOpen && selectedProject && modalType === 'video' && (
                <VideoModal
                    project={selectedProject}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </section>
    );
};

export default Projects;
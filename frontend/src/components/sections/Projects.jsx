import React, { useState, useMemo } from 'react';
import ProjectModal from '../ui/ProjectModal'; // IMPORTAR MODAL
import VideoModal from '../ui/VideoModal'; // IMPORTAR MODAL DE VÍDEO
import styles from './Projects.module.css';

const projectsData = [
    {
        id: 1,
        title: 'Verdiaroma - E-commerce de Velas Artesanais',
        description: 'Loja online completa de velas aromáticas artesanais e produtos ecológicos portugueses. Sistema completo com pagamentos, cálculo de entregas, gestão de produtos e blog corporativo.',
        technologies: ['WordPress', 'Elementor', 'WooCommerce', 'PHP'],
        category: 'web',
        placeholder: 'E-commerce Platform',
        thumbnail: '/portfolio/web/ecommerce-thumb.jpg',
        link: 'https://verdiaroma.shop/',
        featured: true
    },
    {
        id: 2,
        title: 'JUMP - Plataforma de Gestão de Emprego',
        description: 'Plataforma full-stack para alunos da ESTGV acederem a ofertas de emprego personalizadas. Sistema com autenticação, matching de competências e dashboard empresarial.',
        technologies: ['React.js', 'Node.js', 'Express.js', 'PostgreSQL'],
        category: 'web',
        placeholder: 'Job Platform',
        thumbnail: '/portfolio/web/jump-thumb.jpg',
        link: 'https://jump-platform-frontend.onrender.com/',
        featured: true
    },
    {
        id: 3,
        title: 'Site EUNICE - Assembleia Geral Europeia',
        description: 'Website institucional para evento da EUNICE (assembleia de politécnicos europeus). Interface responsiva com programa, palestrantes e inscrições.',
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
        category: 'web',
        placeholder: 'Event Website',
        thumbnail: '/portfolio/web/eunice-site-thumb.jpg',
        link: 'https://euniceipv.github.io/ga/',
        featured: false
    },
    {
        id: 4,
        title: 'App Eventos Viseu - Protótipo',
        description: 'Aplicação móvel para divulgação de eventos em Viseu. Interface intuitiva com filtros, mapa interativo, favoritos e notificações personalizadas.',
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
        description: 'Protótipo completo para website internacional da EUNICE. Inclui jornada do utilizador, wireframes, design system e fluxos de navegação.',
        technologies: ['Figma', 'Design System', 'Wireframing', 'User Journey'],
        category: 'mobile',
        placeholder: 'UI/UX Prototype',
        thumbnail: '/portfolio/prototypes/eunice-prototype-thumb.jpg',
        link: 'https://www.figma.com/proto/TCOYCKof5aw98y6RBcXDhI/Prototipo_Projeto_Integrado_II_23_01_25?page-id=46%3A3&node-id=1036-8600&viewport=-1349%2C356%2C0.09&t=QSh7QjVw79Pd90Tx-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=51%3A9',
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
        link: 'http://193.137.7.33/~aluno28368/Portfolio/',
        featured: true
    },
    {
        id: 7,
        title: 'A Cozinha do Sponnie - App Educativa',
        description: 'Aplicação lúdica para ensinar crianças sobre alimentação saudável. Contém 4 mini-jogos interativos com diferentes temas e níveis progressivos.',
        technologies: ['Unity', 'C#', 'Game Design', 'Educational Games'],
        category: '3d',
        placeholder: 'Educational Game',
        thumbnail: '/portfolio/unity/sponnie-thumb.jpg',
        link: 'http://193.137.7.33/~aluno28368/CIT2_Final/CIpqp/',
        featured: true
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
        description: 'Animação 2D em After Effects explorando movimento e timing. Elementos dinâmicos com transições suaves e narrativa espacial envolvente.',
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
        description: 'Animação promocional inspirada na identidade Adidas. Exploração de movimento de marca com transições dinâmicas e elementos energéticos.',
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
        description: 'Curta-metragem experimental explorando relações familiares. Trabalho completo de edição, color grading e pós-produção.',
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
        description: 'Exploração artística através da fotografia, focando técnicas de composição, jogo de luzes e sombras com visão criativa.',
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
    }
];

const categories = [
    { id: 'all', name: 'Todos os Projetos', count: projectsData.length },
    { id: 'web', name: 'Web', count: projectsData.filter(p => p.category === 'web').length },
    { id: 'mobile', name: 'Mobile/UI', count: projectsData.filter(p => p.category === 'mobile').length },
    { id: '3d', name: 'Unity/Jogos', count: projectsData.filter(p => p.category === '3d').length },
    { id: 'motion', name: 'Motion Design', count: projectsData.filter(p => p.category === 'motion').length },
    { id: 'design', name: 'Design Gráfico', count: projectsData.filter(p => p.category === 'design').length }
];

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
                            className={styles.projectThumbnail}
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
                        className={styles.projectThumbnail}
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
                    <h2 className={styles.projectsTitle}>
                        Trabalhos que demonstram a evolução das minhas competências técnicas e criativas
                    </h2>
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
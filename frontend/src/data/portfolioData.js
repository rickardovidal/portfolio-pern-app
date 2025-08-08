// src/data/portfolioData.js

// Dados para o mosaico do Hero (trabalhos em destaque) - 9 items para grid perfeita
export const showcaseWorks = [
    {
        id: 1,
        type: 'image',
        title: 'Identidade Visual Pizzaria',
        category: 'Design Gráfico',
        aspectRatio: '1:1',
        media: '/portfolio/design/pizzaria-thumb.jpeg',
        thumbnail: '/portfolio/design/pizzaria-thumb.jpeg',
        action: 'modal',
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
        description: 'Sistema completo de identidade visual para pizzaria fictícia incluindo logótipo, papelaria, embalagens e sinalética.',
        technologies: ['Illustrator', 'Photoshop', 'InDesign']
    },
    {
        id: 2,
        type: 'video',
        title: 'Motion Design - Foguetão',
        category: 'Motion Design',
        aspectRatio: '16:9',
        media: '/portfolio/motion/fogetao.mp4',
        thumbnail: '/portfolio/motion/foguetao-thumb.jpg',
        poster: '/portfolio/motion/foguetao-poster.jpeg',
        action: 'video',
        video: '/portfolio/motion/fogetao.mp4',
        description: 'Animação 2D criada em After Effects com elementos dinâmicos e transições suaves.',
        technologies: ['After Effects', 'Illustrator']
    },
    {
        id: 3,
        type: 'image',
        title: 'Cartaz Dia do Origami',
        category: 'Design Gráfico',
        aspectRatio: '5:7',
        media: '/portfolio/design/origami-cartaz.jpeg',
        thumbnail: '/portfolio/design/origami-thumb.jpeg',
        gallery: ['/portfolio/design/origami-cartaz.jpeg'],
        description: 'Cartaz promocional para o Dia Mundial do Origami, explorando formas geométricas e cores vibrantes.',
        technologies: ['Illustrator', 'Photoshop']
    },
    {
        id: 4,
        type: 'prototype',
        title: 'App Eventos Viseu',
        category: 'UI/UX Design',
        aspectRatio: '9:16',
        media: '/portfolio/prototypes/eventos-preview.jpg',
        thumbnail: '/portfolio/prototypes/eventos-thumb.jpg',
        link: 'https://www.figma.com/proto/FePjZVtIrcIfa3pU84DIWd/Proj--3'
    },
       {
        id: 8,
        type: 'Fotografia',
        title: 'Book Fotográfico',
        category: 'Fotografia',
        aspectRatio: '16:9',
        media: '/portfolio/design/book-fotografia.jpg',
        thumbnail: '/portfolio/design/book-fotografia-thumb.jpg',
        action: 'external',
        link: 'https://www.behance.net/gallery/195288761/Book-Composicao-e-Fotografia',
        technologies: ['Adobe Lightroom', 'Behance']
    },
    {
        id: 5,
        type: 'video',
        title: 'Motion Design - Adidas',
        category: 'Motion Design',
        aspectRatio: '16:9',
        media: '/portfolio/motion/adidasanim.mp4',
        thumbnail: '/portfolio/motion/adidasanim-thumb.jpg',
        poster: '/portfolio/motion/adidasanim.jpg',
        action: 'video',
        video: '/portfolio/motion/adidasanim.mp4',
        description: 'Animação 2D criada em After Effects com elementos dinâmicos e transições suaves.',
        technologies: ['After Effects', 'Illustrator']
    },
     {
        id: 7,
        type: 'web',
        title: 'E-commerce Platform',
        category: 'Desenvolvimento Web',
        aspectRatio: '16:9',
        media: '/portfolio/web/ecommerce-preview.jpg',
        thumbnail: '/portfolio/web/ecommerce-thumb.jpg',
        action: 'external',
        link: 'https://verdiaroma.shop'
    },
    {
        id: 6,
        type: 'video',
        title: 'Curta-Metragem "My Brother"',
        category: 'Motion Design',
        aspectRatio: '16:9',
        media: '/portfolio/video/mybrother.mp4',
        thumbnail: '/portfolio/video/mybrother-thumb.jpg',
        poster: '/portfolio/video/mybrother-poster.jpg',
        action: 'video',
        video: '/portfolio/video/mybrother.mp4',
        description: 'Curta-metragem experimental explorando relações familiares.',
        technologies: ['Premiere Pro', 'After Effects']
    },
   
   
];

// Dados completos dos projetos (para a secção Projects)
export const projectsData = [
    {
        id: 1,
        title: 'Identidade Visual - Pizzaria Lugar do Castelo',
        description: 'Sistema completo de identidade visual para pizzaria fictícia incluindo logótipo, papelaria, embalagens e sinalética.',
        type: 'design',
        category: 'Design Gráfico',
        aspectRatio: '16:9',
        thumbnail: '/portfolio/design/pizzaria-thumb.jpg',
        action: 'modal',
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
        technologies: ['Illustrator', 'Photoshop', 'InDesign'],
        featured: true
    },
    {
        id: 2,
        title: 'Motion Design - Animação Foguetão',
        description: 'Animação 2D criada em After Effects com elementos dinâmicos e transições suaves.',
        type: 'motion',
        category: 'Motion Design',
        aspectRatio: '16:9',
        thumbnail: '/portfolio/motion/foguetao-thumb.jpg',
        action: 'modal',
        video: '/portfolio/motion/fogetao.mp4',
        poster: '/portfolio/motion/foguetao-poster.jpg',
        technologies: ['After Effects', 'Illustrator'],
        featured: true
    },
    {
        id: 3,
        type: 'image',
        title: 'Cartaz Dia do Origami',
        category: 'Design Gráfico',
        aspectRatio: '5:7',
        media: '/portfolio/design/origami-cartaz.jpeg',
        thumbnail: '/portfolio/design/origami-thumb.jpeg',
        gallery: ['/portfolio/design/origami-cartaz.jpeg'],
        description: 'Cartaz promocional para o Dia Mundial do Origami, explorando formas geométricas e cores vibrantes.',
        technologies: ['Illustrator', 'Photoshop']
    },
    {
        id: 4,
        title: 'App Eventos Viseu - Protótipo',
        description: 'Aplicação móvel para divulgação de eventos no distrito de Viseu com interface intuitiva.',
        type: 'prototype',
        category: 'UI/UX Design',
        aspectRatio: '9:16',
        thumbnail: '/portfolio/prototypes/eventos-thumb.jpg',
        action: 'prototype',
        prototypeEmbed: 'https://embed.figma.com/proto/FePjZVtIrcIfa3pU84DIWd/Proj--3',
        figmaLink: 'https://www.figma.com/proto/FePjZVtIrcIfa3pU84DIWd/Proj--3',
        technologies: ['Figma', 'UI Design', 'Prototyping'],
        featured: true
    },
   {
        id: 5,
        type: 'video',
        title: 'Motion Design - Adidas',
        category: 'Motion Design',
        aspectRatio: '16:9',
        media: '/portfolio/motion/adidasanim.mp4',
        thumbnail: '/portfolio/motion/adidasanim-thumb.jpg',
        poster: '/portfolio/motion/adidasanim.jpg',
        action: 'video',
        video: '/portfolio/motion/adidasanim.mp4',
        description: 'Animação 2D criada em After Effects com elementos dinâmicos e transições suaves.',
        technologies: ['After Effects', 'Illustrator']
    },
    {
        id: 6,
        type: 'video',
        title: 'Curta-Metragem "My Brother"',
        category: 'Motion Design',
        aspectRatio: '16:9',
        media: '/portfolio/video/mybrother.mp4',
        thumbnail: '/portfolio/video/mybrother-thumb.jpg',
        poster: '/portfolio/video/mybrother-poster.jpg',
        action: 'video',
        video: '/portfolio/video/mybrother.mp4',
        description: 'Curta-metragem experimental explorando relações familiares.',
        technologies: ['Premiere Pro', 'After Effects']
    },
  {
        id: 7,
        type: 'web',
        title: 'E-commerce Platform',
        category: 'Desenvolvimento Web',
        aspectRatio: '16:9',
        media: '/portfolio/web/ecommerce-preview.jpg',
        thumbnail: '/portfolio/web/ecommerce-thumb.jpg',
        action: 'external',
        link: 'https://verdiaroma.shop/'
    },
     {
        id: 8,
        type: 'Fotografia',
        title: 'Book Fotográfico',
        category: 'Desenvolvimento Web',
        aspectRatio: '16:9',
        media: '/portfolio/design/book-fotografia.jpg',
        thumbnail: '/portfolio/design/book-fotografia-thumb.jpg',
        action: 'external',
        link: 'https://www.behance.net/gallery/195288761/Book-Composicao-e-Fotografia',
        technologies: ['Adobe Lightroom', 'Behance']
    },
   
    
];

// Categorias para filtros
export const categories = [
    { id: 'all', name: 'Todos os Projetos', count: projectsData.length },
    { id: 'design', name: 'Design Gráfico', count: projectsData.filter(p => p.type === 'design').length },
    { id: 'motion', name: 'Motion Design', count: projectsData.filter(p => p.type === 'motion').length },
    { id: 'web', name: 'Desenvolvimento Web', count: projectsData.filter(p => p.type === 'web').length },
    { id: 'prototype', name: 'UI/UX Design', count: projectsData.filter(p => p.type === 'prototype').length }
];
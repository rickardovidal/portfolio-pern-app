// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Active section detection
    useEffect(() => {
        const sections = ['home', 'about', 'services', 'projects', 'experience', 'contact-form', 'contact'];
        const observerOptions = { 
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0.2
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        sections.forEach(id => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => {
            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) observer.unobserve(element);
            });
        };
    }, []);

    // Toggle mobile menu
    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };
    
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [menuOpen]);

    // Handle link click
    const handleLinkClick = (e, href) => {
        e.preventDefault();
        
        if (menuOpen) {
            setMenuOpen(false);
        }
        
        const target = document.querySelector(href);
        if (target) {
            const offsetTop = target.offsetTop - 80; // Ajuste de offset
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // Clique no logótipo: se já estiver na homepage, faz scroll suave até ao topo;
    // caso contrário, o Link navega normalmente para "/"
    const handleLogoClick = (e) => {
        if (menuOpen) {
            setMenuOpen(false);
        }
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navLinks = [
        { href: '#about', label: 'Sobre' },
        { href: '#services', label: 'Serviços' },
        { href: '#projects', label: 'Projetos' },
        { href: '#experience', label: 'Percurso' },
        { href: '#contact-form', label: 'Contacto' }
    ];

    return (
        <>
            <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={styles.navContent}>
                    <Link
                        to="/"
                        className={styles.logo}
                        onClick={handleLogoClick}
                    >
                        <img src="/logo.svg" alt="Vidal Creative Studio" className={styles.logoImg} />
                    </Link>
                    
                    <button 
                        className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
                        onClick={toggleMenu}
                        aria-label="Menu de navegação"
                        aria-expanded={menuOpen}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    
                    <ul className={`${styles.navLinks} ${menuOpen ? styles.mobileOpen : ''}`}>
                        {navLinks.map(link => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className={activeSection === link.href.substring(1) ? styles.active : ''}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
            
            <div 
                className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
                onClick={toggleMenu}
                aria-hidden="true"
            ></div>
        </>
    );
};

export default Navbar;

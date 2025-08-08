// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [menuOpen, setMenuOpen] = useState(false);

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
        const sections = ['home', 'about', 'skills', 'projects', 'experience', 'contact-form', 'contact'];
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

    const navLinks = [
        { href: '#about', label: 'Sobre' },
        { href: '#skills', label: 'Skills' },
        { href: '#projects', label: 'Projetos' },
        { href: '#experience', label: 'Percurso' },
        { href: '#contact-form', label: 'Contacto' }
    ];

    return (
        <>
            <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
                <div className={styles.navContent}>
                    <a 
                        href="#home" 
                        className={styles.logo}
                        onClick={(e) => handleLinkClick(e, '#home')}
                    >
                        Ricardo Vidal
                    </a>
                    
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

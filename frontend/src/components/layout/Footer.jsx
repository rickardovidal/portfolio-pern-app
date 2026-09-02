// src/components/layout/Footer.jsx (ATUALIZADO)
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const socialLinks = [
    { platform: 'in', url: 'https://www.linkedin.com/in/vidal-ricardo' },
    { platform: 'gh', url: 'https://github.com/rickardovidal' },
];

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h4>Ricardo Vidal</h4>
                        <p>Desenvolvedor full stack (React, Node.js, PostgreSQL) e designer multimédia, com projetos web já em produção.</p>
                        <div className={styles.socialLinks}>
                            {socialLinks.map((link, index) => (
                                <a 
                                    key={index} 
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className={styles.socialLink}
                                >
                                    {link.platform}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Seções de Links */}
                    <div className={styles.footerSection}>
                        <h4>Projetos</h4>
                        <ul className={styles.footerLinks}>
                            {['Aplicações Web', 'Plataformas Full Stack', 'UI/UX Design', 'Identidade Visual'].map((project, index) => (
                                <li key={index}><a href="#projects">{project}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Competências</h4>
                        <ul className={styles.footerLinks}>
                            {['Frontend', 'Backend', 'Bases de Dados', 'Design & Multimédia'].map((skill, index) => (
                                <li key={index}><a href="#about">{skill}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Contacto</h4>
                        <ul className={styles.footerLinks}>
                            {[
                                { text: 'Email', href: 'mailto:ricardojmv95@gmail.com' },
                                { text: 'Telefone', href: 'tel:+351963507700' },
                            ].map((contact, index) => (
                                <li key={index}><a href={contact.href}>{contact.text}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.footerText}>{new Date().getFullYear()} Ricardo Vidal</div>
                    <ul className={styles.footerLegal}>
                        {/* LINKS ATUALIZADOS para usar React Router */}
                        <li><Link to="/privacidade">Privacidade</Link></li>
                        <li><Link to="/termos">Termos</Link></li>
                        <li><Link to="/cookies">Cookies</Link></li>
                    </ul>
                </div>
                <div>
                    <a target="_blank" href="https://www.zaask.pt/user/ricardojmv95"><img src="https://www.zaask.pt/widget?user=984351&widget=pro-findme" alt="" /></a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
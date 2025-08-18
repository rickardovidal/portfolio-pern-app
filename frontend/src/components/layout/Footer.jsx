// src/components/layout/Footer.jsx (ATUALIZADO)
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const socialLinks = [
    { platform: 'in', url: 'https://www.linkedin.com/in/vidal-ricardo?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B0IBB9K%2FXROC%2FdYUbTBhegA%3D%3D' },
    
];

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h4>Ricardo Vidal</h4>
                        <p>Designer Multimédia e Desenvolvedor especializado em criar experiências digitais inovadoras que combinam estética e funcionalidade.</p>
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
                            {['Portfólio Web', 'Aplicações Mobile', 'Animação 3D', 'UI/UX Design'].map((project, index) => (
                                <li key={index}><a href="#projects">{project}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Competências</h4>
                        <ul className={styles.footerLinks}>
                            {['Web Development', 'Mobile Apps', '2D & 3D Graphics', 'Database Design'].map((skill, index) => (
                                <li key={index}><a href="#projects">{skill}</a></li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Contacto</h4>
                        <ul className={styles.footerLinks}>
                            {[
                                { text: 'Email', href: 'mailto:ricardojmv95@gmail.com' },
                                { text: 'Telefone', href: 'tel:+351123456789' },
                            ].map((contact, index) => (
                                <li key={index}><a href={contact.href}>{contact.text}</a></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.footerText}>2025 Ricardo Vidal</div>
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
import React, { useState, useEffect } from 'react';
import styles from './BackToTopButton.module.css';

const BackToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return isVisible ? (
        <button 
            className={styles.backToTop}
            onClick={scrollToTop}
        >
            ↑
        </button>
    ) : null;
};

export default BackToTopButton;
import React from 'react';
import styles from './WhatsAppButton.module.css';

const WhatsAppButton = () => {
    return (
        <a
            href="https://wa.me/351963507700"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappButton}
            aria-label="Contactar via WhatsApp"
        >
            <i className="bi bi-whatsapp"></i>
        </a>
    );
};

export default WhatsAppButton;

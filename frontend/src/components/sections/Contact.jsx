import React from 'react';
import styles from './Contact.module.css';

const contactLinks = [
    { 
        text: 'ricardo@exemplo.com', 
        href: 'mailto:ricardo@exemplo.com' 
    },
    { 
        text: 'LinkedIn', 
        href: 'https://linkedin.com/in/ricardovidal',
        target: '_blank'
    },
    { 
        text: 'GitHub', 
        href: 'https://github.com/ricardovidal',
        target: '_blank'
    },
    { 
        text: 'Behance', 
        href: 'https://behance.net/ricardovidal',
        target: '_blank'
    }
];

const Contact = () => {
    return (
        <section className={styles.contact} id="contact">
            <div className={styles.contactContainer}>
                <div className={styles.contactText}>
                    <h2>Interessado em colaborar ou saber mais sobre este trabalho?</h2>
                    <p className='col-sm-12 col-md-6'>
                        Disponibilidade total para discutir novas oportunidades,
                        projetos interessantes ou simplesmente uma conversa
                        sobre design e tecnologia.
                    </p>
                
                </div>
               
            </div>
        </section>
    );
};

export default Contact;
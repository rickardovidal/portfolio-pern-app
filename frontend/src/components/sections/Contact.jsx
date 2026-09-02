import React from 'react';
import styles from './Contact.module.css';

const contactLinks = [
    {
        text: 'ricardojmv95@gmail.com',
        href: 'mailto:ricardojmv95@gmail.com'
    },
    {
        text: 'LinkedIn',
        href: 'https://www.linkedin.com/in/vidal-ricardo',
        target: '_blank'
    },
    {
        text: 'GitHub',
        href: 'https://github.com/rickardovidal',
        target: '_blank'
    }
];

const Contact = () => {
    return (
        <section className={styles.contact} id="contact">
            <div className={styles.contactContainer}>
                <div className={styles.contactText}>
                    <h2>Interessado em colaborar ou saber mais sobre o meu trabalho?</h2>
                    <p className='col-sm-12 col-md-6'>
                        Estou sempre disponível para discutir novas oportunidades, 
                        projetos interessantes ou simplesmente para uma conversa 
                        sobre design e tecnologia.
                    </p>
                
                </div>
               
            </div>
        </section>
    );
};

export default Contact;
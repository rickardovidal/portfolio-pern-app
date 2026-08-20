// src/pages/TermsConditions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

const TermsConditions = () => {
    return (
        <div className={styles.legalPage}>
            <div className={styles.container}>
                {/* Navegação de volta */}
                <div className={styles.backNavigation}>
                    <Link to="/" className={styles.backLink}>
                        ← Voltar ao Portfolio
                    </Link>
                </div>

                <h1>Termos e Condições de Utilização</h1>
                <p className={styles.lastUpdated}>Última atualização: 3 de agosto de 2025</p>

                <section>
                    <h2>1. Objeto e Âmbito</h2>
                    <p>
                        Os presentes termos e condições regulam a utilização do website portfolio de 
                        Ricardo Vidal, disponível online, que tem como objetivo a apresentação de 
                        projetos, competências e serviços profissionais na área de Design Multimédia 
                        e Desenvolvimento Web.
                    </p>
                </section>

                <section>
                    <h2>2. Identificação do Responsável</h2>
                    <p>
                        <strong>Nome:</strong> Ricardo Vidal<br/>
                        <strong>Email:</strong> ricardojmv95@gmail.com<br/>
                        <strong>Atividade:</strong> Designer Multimédia e Desenvolvedor Web<br/>
                        <strong>Estatuto:</strong> Estudante no Instituto Politécnico de Viseu - ESTGV
                    </p>
                </section>

                <section>
                    <h2>3. Condições de Utilização</h2>
                    <p>A utilização deste website implica a aceitação plena e sem reservas dos presentes termos e condições.</p>
                    
                    <h3>3.1 Utilizações Permitidas</h3>
                    <ul>
                        <li>Navegação e consulta do conteúdo disponibilizado</li>
                        <li>Utilização do formulário de contacto para fins legítimos</li>
                        <li>Partilha do URL do website</li>
                        <li>Citação do conteúdo com devida atribuição</li>
                    </ul>

                    <h3>3.2 Utilizações Proibidas</h3>
                    <ul>
                        <li>Reprodução, distribuição ou modificação não autorizada do conteúdo</li>
                        <li>Utilização para fins ilícitos ou prejudiciais</li>
                        <li>Tentativas de acesso não autorizado aos sistemas</li>
                        <li>Envio de comunicações não solicitadas ou spam</li>
                        <li>Utilização que viole direitos de propriedade intelectual</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Propriedade Intelectual</h2>
                    <p>
                        Todos os conteúdos deste website, incluindo mas não limitando-se a textos, 
                        imagens, código fonte, design gráfico, logótipos e projetos apresentados, 
                        são propriedade de Ricardo Vidal ou utilizados com autorização dos respetivos 
                        titulares de direitos.
                    </p>
                    <p>
                        A reprodução, distribuição, comunicação pública ou transformação destes conteúdos 
                        sem autorização prévia constitui violação dos direitos de propriedade intelectual.
                    </p>
                </section>

                <section>
                    <h2>5. Serviços Disponibilizados</h2>
                    <p>
                        Este website destina-se à apresentação de serviços profissionais, incluindo:
                    </p>
                    <ul>
                        <li>Desenvolvimento de websites e aplicações web</li>
                        <li>Desenvolvimento de aplicações móveis</li>
                        <li>Design gráfico e multimédia</li>
                        <li>Conceção e gestão de bases de dados</li>
                        <li>Consultoria em projetos digitais</li>
                    </ul>
                    <p>
                        As condições específicas de prestação de serviços são definidas individualmente 
                        mediante proposta comercial e contrato específico.
                    </p>
                </section>

                <section>
                    <h2>6. Isenção de Responsabilidade</h2>
                    <p>
                        Ricardo Vidal não se responsabiliza por:
                    </p>
                    <ul>
                        <li>Interrupções temporárias no funcionamento do website</li>
                        <li>Eventuais inexatidões ou omissões no conteúdo</li>
                        <li>Danos resultantes da utilização inadequada do website</li>
                        <li>Conteúdo de websites de terceiros acedidos através de ligações externas</li>
                        <li>Prejuízos decorrentes de falhas técnicas ou de conectividade</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Proteção de Dados Pessoais</h2>
                    <p>
                        O tratamento de dados pessoais rege-se pela 
                        <Link to="/privacidade"> Política de Privacidade</Link> deste website, 
                        que constitui parte integrante dos presentes termos e condições.
                    </p>
                </section>

                <section>
                    <h2>8. Ligações para Websites de Terceiros</h2>
                    <p>
                        Este website pode conter ligações para websites de terceiros. 
                        Ricardo Vidal não exerce qualquer controlo sobre esses websites 
                        e não se responsabiliza pelo seu conteúdo ou práticas de privacidade.
                    </p>
                </section>

                <section>
                    <h2>9. Modificações</h2>
                    <p>
                        Ricardo Vidal reserva-se o direito de modificar os presentes termos e condições 
                        a qualquer momento. As alterações entram em vigor imediatamente após a sua 
                        publicação nesta página, sendo indicada a data da última atualização.
                    </p>
                </section>

                <section>
                    <h2>10. Lei Aplicável e Jurisdição</h2>
                    <p>
                        Os presentes termos e condições regem-se pela lei portuguesa. 
                        Para a resolução de qualquer litígio, serão competentes os tribunais 
                        da comarca da residência do responsável pelo website.
                    </p>
                </section>

                <section>
                    <h2>11. Contactos</h2>
                    <p>
                        Para questões relacionadas com os presentes termos e condições, 
                        pode contactar através de:
                    </p>
                    <p>
                        <strong>Email:</strong> <a href="mailto:ricardojmv95@gmail.com">ricardojmv95@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsConditions;
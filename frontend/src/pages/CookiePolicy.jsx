// src/pages/CookiePolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

const CookiePolicy = () => {
    return (
        <div className={styles.legalPage}>
            <div className={styles.container}>
                {/* Navegação de volta */}
                <div className={styles.backNavigation}>
                    <Link to="/" className={styles.backLink}>
                        ← Voltar ao Portfolio
                    </Link>
                </div>

                <h1>Política de Cookies</h1>
                <p className={styles.lastUpdated}>Última atualização: 3 de agosto de 2025</p>

                <section>
                    <h2>1. Definição de Cookies</h2>
                    <p>
                        Os cookies são pequenos ficheiros de texto armazenados no dispositivo do utilizador 
                        quando este visita um website. Estes ficheiros permitem ao website reconhecer o 
                        dispositivo do utilizador e armazenar determinadas informações sobre as suas 
                        preferências ou ações passadas.
                    </p>
                </section>

                <section>
                    <h2>2. Cookies Utilizados Atualmente</h2>
                    <p>
                        <strong>Este website não utiliza cookies de terceiros ou cookies não essenciais.</strong>
                    </p>
                    <p>
                        A única informação armazenada localmente é relativa à autenticação da área 
                        administrativa do website, através de tecnologia localStorage, que não constitui 
                        propriamente um cookie e destina-se exclusivamente ao funcionamento técnico da plataforma.
                    </p>
                </section>

                <section>
                    <h2>3. Tipos de Cookies que Poderão Ser Utilizados</h2>
                    <p>
                        No futuro, este website poderá utilizar os seguintes tipos de cookies:
                    </p>
                    
                    <h3>3.1 Cookies Estritamente Necessários</h3>
                    <p>
                        Cookies essenciais para o funcionamento básico do website, incluindo cookies 
                        de segurança e de sessão. Estes cookies não requerem consentimento do utilizador.
                    </p>

                    <h3>3.2 Cookies de Performance e Analytics</h3>
                    <p>
                        Cookies que recolhem informações sobre como os visitantes utilizam o website, 
                        tais como as páginas mais visitadas ou mensagens de erro. Estas informações 
                        são utilizadas para melhorar o funcionamento do website.
                    </p>

                    <h3>3.3 Cookies de Funcionalidade</h3>
                    <p>
                        Cookies que permitem ao website recordar escolhas feitas pelo utilizador 
                        (como idioma ou região) e fornecer funcionalidades melhoradas e mais personalizadas.
                    </p>
                </section>

                <section>
                    <h2>4. Finalidades da Utilização de Cookies</h2>
                    <p>
                        Quando implementados, os cookies serão utilizados para:
                    </p>
                    <ul>
                        <li>Garantir o funcionamento técnico adequado do website</li>
                        <li>Melhorar a experiência de navegação do utilizador</li>
                        <li>Recolher estatísticas de utilização de forma anónima</li>
                        <li>Recordar preferências e definições do utilizador</li>
                        <li>Otimizar o desempenho e funcionalidades do website</li>
                    </ul>
                </section>

                <section>
                    <h2>5. Gestão de Cookies</h2>
                    <p>
                        Os utilizadores podem controlar e gerir cookies através das seguintes opções:
                    </p>
                    <ul>
                        <li><strong>Definições do navegador:</strong> Configurar o navegador para aceitar, rejeitar ou eliminar cookies</li>
                        <li><strong>Consentimento:</strong> Quando implementado, será disponibilizado um mecanismo de gestão de consentimento</li>
                        <li><strong>Eliminação manual:</strong> Remover cookies já armazenados através das definições do navegador</li>
                    </ul>
                    <p>
                        A desativação de cookies pode afetar o funcionamento de algumas funcionalidades do website.
                    </p>
                </section>

                <section>
                    <h2>6. Cookies de Terceiros</h2>
                    <p>
                        Atualmente, este website não utiliza cookies de terceiros. No futuro, 
                        caso sejam implementados serviços de terceiros (como Google Analytics), 
                        será solicitado o consentimento adequado e fornecida informação detalhada 
                        sobre tais cookies.
                    </p>
                </section>

                <section>
                    <h2>7. Período de Conservação</h2>
                    <p>
                        Os cookies, quando utilizados, terão períodos de conservação adequados às suas finalidades:
                    </p>
                    <ul>
                        <li><strong>Cookies de sessão:</strong> Eliminados quando o navegador é fechado</li>
                        <li><strong>Cookies persistentes:</strong> Período máximo de 24 meses, salvo justificação específica</li>
                        <li><strong>Cookies de analytics:</strong> Período conforme definições do fornecedor do serviço</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Direitos dos Utilizadores</h2>
                    <p>
                        Os utilizadores têm o direito de:
                    </p>
                    <ul>
                        <li>Ser informados sobre a utilização de cookies</li>
                        <li>Dar ou recusar o consentimento para cookies não essenciais</li>
                        <li>Retirar o consentimento a qualquer momento</li>
                        <li>Aceder às informações armazenadas em cookies</li>
                        <li>Solicitar a eliminação de dados recolhidos através de cookies</li>
                    </ul>
                </section>

                <section>
                    <h2>9. Alterações a Esta Política</h2>
                    <p>
                        Esta política de cookies pode ser atualizada para refletir alterações 
                        nas práticas de utilização de cookies. As alterações serão comunicadas 
                        através da atualização desta página, sendo indicada a data da última revisão.
                    </p>
                </section>

                <section>
                    <h2>10. Contactos</h2>
                    <p>
                        Para questões relacionadas com a utilização de cookies, pode contactar:
                    </p>
                    <p>
                        <strong>Email:</strong> <a href="mailto:ricardojmv95@gmail.com">ricardojmv95@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CookiePolicy;
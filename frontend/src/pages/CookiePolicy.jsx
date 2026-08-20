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
                <p className={styles.lastUpdated}>Última atualização: 20 de agosto de 2026</p>

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
                    <h2>2. Cookies Utilizados por Este Website</h2>
                    <p>
                        <strong>Este website não instala cookies próprios de rastreio, publicidade ou analytics.</strong>
                    </p>
                    <p>
                        A única informação armazenada localmente no navegador é o token de autenticação da
                        área administrativa do website, através da tecnologia <strong>localStorage</strong>.
                        Este mecanismo não constitui, tecnicamente, um cookie: não é enviado
                        automaticamente ao servidor em cada pedido nem é acessível a terceiros, e
                        destina-se exclusivamente ao funcionamento técnico da área reservada, não sendo
                        utilizado para fins de rastreio dos visitantes do website.
                    </p>
                </section>

                <section>
                    <h2>3. Conteúdos e Ligações de Terceiros</h2>
                    <p>
                        Embora não instale cookies próprios, este website integra alguns elementos
                        fornecidos por serviços de terceiros, que podem estar sujeitos às respetivas
                        políticas de privacidade e cookies:
                    </p>
                    <ul>
                        <li>
                            <strong>Zaask:</strong> o rodapé apresenta um selo/imagem carregada diretamente
                            a partir dos servidores da Zaask, que pode envolver a definição de cookies
                            próprios da Zaask no âmbito do funcionamento desse selo. Consulte a{' '}
                            <a href="https://www.zaask.pt" target="_blank" rel="noopener noreferrer">política de privacidade da Zaask</a>{' '}
                            para mais informação.
                        </li>
                        <li>
                            <strong>WhatsApp:</strong> o botão de contacto flutuante é uma simples ligação
                            para <code>wa.me</code>, que abre a aplicação ou o website do WhatsApp num
                            separador/aplicação distinta. Este website não define quaisquer cookies através
                            desse botão; uma vez no WhatsApp, aplica-se a política de privacidade da Meta.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>4. Tipos de Cookies que Poderão Vir a Ser Utilizados</h2>
                    <p>
                        Caso este website passe futuramente a utilizar cookies próprios, estes
                        enquadrar-se-ão nas seguintes categorias:
                    </p>

                    <h3>4.1 Cookies Estritamente Necessários</h3>
                    <p>
                        Cookies essenciais para o funcionamento básico do website, incluindo cookies de
                        segurança e de sessão. Estes cookies não requerem consentimento do utilizador.
                    </p>

                    <h3>4.2 Cookies de Performance e Analytics</h3>
                    <p>
                        Cookies que recolhem informações sobre como os visitantes utilizam o website, tais
                        como as páginas mais visitadas ou mensagens de erro, com o objetivo de melhorar o
                        seu funcionamento.
                    </p>

                    <h3>4.3 Cookies de Funcionalidade</h3>
                    <p>
                        Cookies que permitem ao website recordar escolhas feitas pelo utilizador (como
                        idioma ou região) e fornecer funcionalidades melhoradas e mais personalizadas.
                    </p>

                    <p>
                        Se, no futuro, forem implementados cookies não essenciais (por exemplo, uma
                        ferramenta de analytics), será apresentado um mecanismo de consentimento prévio,
                        em conformidade com a Lei n.º 41/2004 (alterada pela Lei n.º 46/2012) e as
                        orientações da CNPD sobre cookies.
                    </p>
                </section>

                <section>
                    <h2>5. Gestão de Cookies</h2>
                    <p>
                        Os utilizadores podem controlar e gerir cookies através das seguintes opções:
                    </p>
                    <ul>
                        <li><strong>Definições do navegador:</strong> configurar o navegador para aceitar, rejeitar ou eliminar cookies</li>
                        <li><strong>Consentimento:</strong> quando implementado, será disponibilizado um mecanismo de gestão de consentimento</li>
                        <li><strong>Eliminação manual:</strong> remover cookies já armazenados através das definições do navegador</li>
                    </ul>
                    <p>
                        A desativação de cookies pode afetar o funcionamento de algumas funcionalidades do website.
                    </p>
                </section>

                <section>
                    <h2>6. Período de Conservação</h2>
                    <p>
                        Os cookies, quando utilizados, terão períodos de conservação adequados às suas finalidades:
                    </p>
                    <ul>
                        <li><strong>Cookies de sessão:</strong> eliminados quando o navegador é fechado</li>
                        <li><strong>Cookies persistentes:</strong> período máximo de 24 meses, salvo justificação específica</li>
                        <li><strong>Cookies de analytics:</strong> período conforme definições do respetivo fornecedor</li>
                    </ul>
                </section>

                <section>
                    <h2>7. Direitos dos Utilizadores</h2>
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
                    <h2>8. Alterações a Esta Política</h2>
                    <p>
                        Esta política de cookies pode ser atualizada para refletir alterações nas práticas
                        de utilização de cookies. As alterações serão comunicadas através da atualização
                        desta página, sendo indicada a data da última revisão.
                    </p>
                </section>

                <section>
                    <h2>9. Contactos</h2>
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

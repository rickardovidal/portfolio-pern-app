// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LegalPage.module.css';

const PrivacyPolicy = () => {
    return (
        <div className={styles.legalPage}>
            <div className={styles.container}>
                {/* Navegação de volta */}
                <div className={styles.backNavigation}>
                    <Link to="/" className={styles.backLink}>
                        ← Voltar ao Portfolio
                    </Link>
                </div>

                <h1>Política de Privacidade</h1>
                <p className={styles.lastUpdated}>Última atualização: 3 de agosto de 2025</p>

                <section>
                    <h2>1. Identificação do Responsável pelo Tratamento</h2>
                    <p>
                        <strong>Nome:</strong> Ricardo Vidal<br/>
                        <strong>Email:</strong> ricardojmv95@gmail.com<br/>
                        <strong>Atividade:</strong> Designer Multimédia e Desenvolvedor Web<br/>
                        <strong>Instituição:</strong> Instituto Politécnico de Viseu - Escola Superior de Tecnologia e Gestão de Viseu
                    </p>
                </section>

                <section>
                    <h2>2. Dados Pessoais Recolhidos</h2>
                    <p>No âmbito da utilização do formulário de contacto deste website, são recolhidos os seguintes dados pessoais:</p>
                    <ul>
                        <li><strong>Nome completo</strong> - para identificação do requerente e personalização da resposta</li>
                        <li><strong>Endereço de correio eletrónico</strong> - para estabelecimento de contacto e resposta às solicitações</li>
                        <li><strong>Número de telefone</strong> (facultativo) - para contacto telefónico quando necessário</li>
                        <li><strong>Nome da empresa</strong> (facultativo) - para contextualização profissional da solicitação</li>
                        <li><strong>Assunto e mensagem</strong> - para compreensão da natureza da solicitação</li>
                        <li><strong>Endereço IP</strong> - para fins de segurança e prevenção de spam</li>
                        <li><strong>Data e hora do envio</strong> - para registo temporal da comunicação</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Finalidades do Tratamento</h2>
                    <p>Os dados pessoais recolhidos são tratados exclusivamente para as seguintes finalidades:</p>
                    <ul>
                        <li>Resposta às mensagens de contacto recebidas</li>
                        <li>Prestação de informações sobre serviços oferecidos</li>
                        <li>Estabelecimento e manutenção de contacto profissional</li>
                        <li>Gestão administrativa e comercial</li>
                        <li>Cumprimento de obrigações legais aplicáveis</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Base Legal do Tratamento</h2>
                    <p>
                        O tratamento dos dados pessoais baseia-se no <strong>consentimento explícito</strong> manifestado 
                        pelo titular dos dados ao submeter o formulário de contacto, bem como no <strong>interesse legítimo</strong> 
                        do responsável pelo tratamento em responder às solicitações recebidas, nos termos do artigo 6.º 
                        do Regulamento Geral sobre a Proteção de Dados (RGPD).
                    </p>
                </section>

                <section>
                    <h2>5. Comunicação de Dados a Terceiros</h2>
                    <p>
                        Os dados pessoais recolhidos <strong>não são comunicados, vendidos ou partilhados com terceiros</strong>, 
                        sendo utilizados exclusivamente pelo responsável pelo tratamento para as finalidades descritas 
                        na presente política.
                    </p>
                    <p>
                        Excecionalmente, os dados poderão ser comunicados a terceiros quando tal seja exigido por lei 
                        ou por ordem de autoridade judicial competente.
                    </p>
                </section>

                <section>
                    <h2>6. Prazo de Conservação dos Dados</h2>
                    <p>
                        Os dados pessoais são conservados pelo período estritamente necessário para o cumprimento 
                        das finalidades para as quais foram recolhidos, respeitando os seguintes prazos:
                    </p>
                    <ul>
                        <li>Mensagens de contacto sem desenvolvimento comercial: 1 ano após o último contacto</li>
                        <li>Dados relativos a relações contratuais: 5 anos após a cessação do contrato</li>
                        <li>Dados para cumprimento de obrigações fiscais: conforme legislação aplicável</li>
                    </ul>
                    <p>
                        Findo o prazo de conservação, os dados são eliminados de forma segura e irreversível.
                    </p>
                </section>

                <section>
                    <h2>7. Direitos dos Titulares dos Dados</h2>
                    <p>Nos termos do RGPD, os titulares dos dados dispõem dos seguintes direitos:</p>
                    <ul>
                        <li><strong>Direito de acesso:</strong> Obter informação sobre os dados pessoais objeto de tratamento</li>
                        <li><strong>Direito de retificação:</strong> Solicitar a correção de dados inexatos ou incompletos</li>
                        <li><strong>Direito ao apagamento:</strong> Solicitar a eliminação dos dados pessoais</li>
                        <li><strong>Direito à portabilidade:</strong> Receber os dados num formato estruturado e de uso comum</li>
                        <li><strong>Direito de oposição:</strong> Opor-se ao tratamento dos dados pessoais</li>
                        <li><strong>Direito à limitação do tratamento:</strong> Solicitar a suspensão do tratamento</li>
                        <li><strong>Direito de retirar o consentimento:</strong> Retirar o consentimento a qualquer momento</li>
                    </ul>
                    <p>
                        Para exercer estes direitos, o titular dos dados deve enviar solicitação para: 
                        <a href="mailto:ricardojmv95@gmail.com">ricardojmv95@gmail.com</a>
                    </p>
                </section>

                <section>
                    <h2>8. Medidas de Segurança</h2>
                    <p>
                        São implementadas medidas técnicas e organizacionais adequadas para assegurar um nível 
                        de segurança apropriado ao risco, incluindo proteção contra o acesso não autorizado, 
                        alteração, divulgação ou destruição dos dados pessoais.
                    </p>
                </section>

                <section>
                    <h2>9. Transferências Internacionais</h2>
                    <p>
                        Os dados pessoais são tratados e armazenados no Espaço Económico Europeu. 
                        Não são efetuadas transferências de dados para países terceiros.
                    </p>
                </section>

                <section>
                    <h2>10. Direito de Reclamação</h2>
                    <p>
                        Os titulares dos dados têm o direito de apresentar reclamação junto da autoridade 
                        de controlo competente - Comissão Nacional de Proteção de Dados (CNPD), 
                        através do website <a href="https://www.cnpd.pt" target="_blank">www.cnpd.pt</a> 
                        ou por correio postal para Av. D. Carlos I, 134, 1.º, 1200-651 Lisboa.
                    </p>
                </section>

                <section>
                    <h2>11. Alterações à Política de Privacidade</h2>
                    <p>
                        A presente política de privacidade pode ser atualizada periodicamente. 
                        As alterações serão comunicadas através da publicação da versão atualizada 
                        nesta página, com indicação da data da última revisão.
                    </p>
                </section>

                <section>
                    <h2>12. Contactos</h2>
                    <p>
                        Para questões relacionadas com o tratamento de dados pessoais ou com a presente 
                        política de privacidade, pode contactar:
                    </p>
                    <p>
                        <strong>Email:</strong> <a href="mailto:ricardojmv95@gmail.com">ricardojmv95@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
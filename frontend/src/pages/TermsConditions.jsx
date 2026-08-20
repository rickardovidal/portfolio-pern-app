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
                <p className={styles.lastUpdated}>Última atualização: 20 de agosto de 2026</p>

                <section>
                    <h2>1. Objeto e Âmbito</h2>
                    <p>
                        Os presentes termos e condições ("Termos") regulam o acesso e a utilização do
                        website disponibilizado sob a marca <strong>Vidal Creative Studio</strong>, que
                        tem como objeto a apresentação de projetos, competências e serviços profissionais
                        nas áreas de Design Multimédia e Desenvolvimento Web. A utilização do website
                        implica a aceitação plena e sem reservas destes Termos.
                    </p>
                </section>

                <section>
                    <h2>2. Identificação do Prestador de Serviços</h2>
                    <p>
                        <strong>Nome:</strong> Ricardo Vidal<br/>
                        <strong>Marca comercial:</strong> Vidal Creative Studio<br/>
                        <strong>Email:</strong> <a href="mailto:ricardojmv95@gmail.com">ricardojmv95@gmail.com</a><br/>
                        <strong>Atividade:</strong> Trabalhador independente, com atividade aberta em
                        território português, na área de Design Multimédia e Desenvolvimento Web<br/>
                        <strong>País de estabelecimento:</strong> Portugal
                    </p>
                    <p>
                        Dados adicionais de identificação fiscal (NIF) e morada são disponibilizados
                        diretamente aos clientes no âmbito da contratação de serviços, nomeadamente em
                        propostas, contratos e documentos de faturação.
                    </p>
                </section>

                <section>
                    <h2>3. Condições de Utilização do Website</h2>
                    <p>A utilização deste website implica a aceitação plena e sem reservas dos presentes Termos.</p>

                    <h3>3.1 Utilizações Permitidas</h3>
                    <ul>
                        <li>Navegação e consulta do conteúdo disponibilizado</li>
                        <li>Utilização do formulário de contacto para fins legítimos</li>
                        <li>Partilha do URL do website</li>
                        <li>Citação de conteúdo com a devida atribuição</li>
                    </ul>

                    <h3>3.2 Utilizações Proibidas</h3>
                    <ul>
                        <li>Reprodução, distribuição ou modificação não autorizada do conteúdo</li>
                        <li>Utilização para fins ilícitos ou prejudiciais a terceiros</li>
                        <li>Tentativas de acesso não autorizado a sistemas ou áreas restritas</li>
                        <li>Envio de comunicações não solicitadas ou spam através do formulário de contacto</li>
                        <li>Utilização que viole direitos de propriedade intelectual de terceiros</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Propriedade Intelectual</h2>
                    <p>
                        Todos os conteúdos deste website, incluindo, mas não se limitando a, textos,
                        imagens, código-fonte, design gráfico, logótipos e projetos apresentados, são
                        propriedade de Ricardo Vidal ou são utilizados com autorização dos respetivos
                        titulares de direitos.
                    </p>
                    <p>
                        A reprodução, distribuição, comunicação pública ou transformação destes conteúdos
                        sem autorização prévia constitui violação dos direitos de propriedade intelectual
                        e industrial aplicáveis, nos termos do Código do Direito de Autor e dos Direitos
                        Conexos e do Código da Propriedade Industrial.
                    </p>
                </section>

                <section>
                    <h2>5. Serviços Prestados e Contratação</h2>
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
                        A apresentação de serviços neste website não constitui, por si só, uma proposta
                        contratual vinculativa. As condições específicas de cada serviço — nomeadamente
                        preço, prazos, âmbito de trabalho e forma de pagamento — são definidas
                        individualmente mediante proposta comercial e, sempre que aplicável, formalizadas
                        em contrato ou orçamento aceite por ambas as partes.
                    </p>
                </section>

                <section>
                    <h2>6. Direito de Resolução em Contratos Celebrados à Distância</h2>
                    <p>
                        Quando um serviço seja contratado à distância com um cliente na qualidade de
                        consumidor, aplica-se o regime previsto no Decreto-Lei n.º 24/2014, que confere
                        ao consumidor o direito de livre resolução do contrato no prazo de 14 dias
                        seguidos, sem necessidade de indicar qualquer motivo, salvo nas exceções previstas
                        na lei — nomeadamente quando o serviço tenha sido integralmente prestado e o
                        consumidor tenha dado o seu acordo prévio e expresso ao início da execução antes
                        do termo desse prazo, com reconhecimento de que perde o direito de resolução após
                        a conclusão do serviço.
                    </p>
                </section>

                <section>
                    <h2>7. Isenção de Responsabilidade</h2>
                    <p>
                        No âmbito da utilização deste website, e sem prejuízo das obrigações contratuais
                        específicas assumidas na prestação de serviços, não é assumida responsabilidade por:
                    </p>
                    <ul>
                        <li>Interrupções temporárias no funcionamento do website</li>
                        <li>Eventuais inexatidões ou omissões no conteúdo apresentado</li>
                        <li>Danos resultantes da utilização inadequada do website</li>
                        <li>Conteúdo de websites de terceiros acedidos através de ligações externas</li>
                        <li>Prejuízos decorrentes de falhas técnicas ou de conectividade alheias ao website</li>
                    </ul>
                </section>

                <section>
                    <h2>8. Proteção de Dados Pessoais</h2>
                    <p>
                        O tratamento de dados pessoais rege-se pela
                        {' '}<Link to="/privacidade">Política de Privacidade</Link>{' '}
                        deste website, elaborada em conformidade com o Regulamento (UE) 2016/679 (RGPD) e
                        com a Lei n.º 58/2019, que constitui parte integrante dos presentes Termos.
                    </p>
                </section>

                <section>
                    <h2>9. Resolução Alternativa de Litígios e Livro de Reclamações</h2>
                    <p>
                        Em caso de litígio de consumo, o cliente pode recorrer a uma Entidade de Resolução
                        Alternativa de Litígios de Consumo, nos termos da Lei n.º 144/2015, ou submeter a
                        reclamação através da Plataforma Europeia de Resolução de Litígios em Linha (ODR),
                        disponível em{' '}
                        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
                            ec.europa.eu/consumers/odr
                        </a>.
                    </p>
                    <p>
                        Nos termos do Decreto-Lei n.º 74-A/2017, é ainda disponibilizado o acesso ao Livro
                        de Reclamações Eletrónico através do link presente no rodapé deste website ou
                        diretamente em{' '}
                        <a href="https://www.livroreclamacoes.pt/Inicio/" target="_blank" rel="noopener noreferrer">
                            www.livroreclamacoes.pt
                        </a>.
                    </p>
                </section>

                <section>
                    <h2>10. Ligações para Websites de Terceiros</h2>
                    <p>
                        Este website pode conter ligações para websites de terceiros, incluindo redes
                        sociais e plataformas de avaliação de serviços. Não é exercido qualquer controlo
                        sobre esses websites nem assumida responsabilidade pelo respetivo conteúdo ou
                        práticas de privacidade.
                    </p>
                </section>

                <section>
                    <h2>11. Modificações</h2>
                    <p>
                        Os presentes Termos podem ser modificados a qualquer momento. As alterações entram
                        em vigor imediatamente após a sua publicação nesta página, sendo indicada a data
                        da última atualização.
                    </p>
                </section>

                <section>
                    <h2>12. Lei Aplicável e Jurisdição</h2>
                    <p>
                        Os presentes Termos regem-se pela lei portuguesa e, subsidiariamente, pelo direito
                        da União Europeia aplicável. Para a resolução de qualquer litígio que não seja
                        passível de resolução alternativa, é competente o tribunal da comarca de residência
                        ou domicílio do consumidor, quando aplicável, ou o tribunal legalmente competente
                        nos demais casos.
                    </p>
                </section>

                <section>
                    <h2>13. Contactos</h2>
                    <p>
                        Para questões relacionadas com os presentes Termos, pode contactar através de:
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

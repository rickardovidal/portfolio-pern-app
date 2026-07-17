// Tabela de referência de preços/hora para freelancers juniores em Portugal.
// Valores indicativos, compilados a partir de pesquisa de mercado (julho de 2026).
// Editar aqui quando quiseres atualizar os valores ou acrescentar áreas.

export const DATA_PESQUISA = 'julho de 2026';

export const CUSTO_HORA_PADRAO = 15;

export const tabelaReferenciaPrecos = [
    {
        area: 'Desenvolvimento Web',
        minimo: 15,
        maximo: 30,
        notas: 'Mercado geral: 30-125€/h (média ~50€/h). Juniores praticam valores mais modestos.'
    },
    {
        area: 'Design Gráfico',
        minimo: 12,
        maximo: 20,
        notas: 'Média nacional de freelancers ~25€/h; projetos fixos entre 20€ e 1200€.'
    },
    {
        area: 'Motion Design / Vídeo',
        minimo: 15,
        maximo: 25,
        notas: 'Projetos entre 150€ e 3500€ (média ~360€/projeto).'
    }
];

export const fontesPesquisa = [
    { nome: 'Zaask: criação de websites', url: 'https://www.zaask.pt/quanto-custa/criacao-de-websites' },
    { nome: 'Zaask: design gráfico', url: 'https://www.zaask.pt/quanto-custa/design-grafico' },
    { nome: 'Zaask: motion design', url: 'https://www.zaask.pt/quanto-custa/motion-design' },
    { nome: 'Fixando: preços design gráfico', url: 'https://www.fixando.pt/en/servico-design-grafico/preco' },
    { nome: 'Indeed: salários freelancer PT', url: 'https://pt.indeed.com/career/freelancer/salaries' }
];

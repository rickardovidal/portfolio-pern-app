require('dotenv').config();
const sequelize = require('../config/database');
const defineAssociations = require('../models/associations');

// Importar todos os modelos
const Utilizador = require('../models/Utilizador');
const Tipos_Clientes = require('../models/Tipos_Clientes');
const Clientes = require('../models/Clientes');
const Estados_Projeto = require('../models/Estados_Projeto');
const Projetos = require('../models/Projetos');
const Tipos_Servicos = require('../models/tipos_servicos');
const Servicos = require('../models/Servicos');
const Projetos_Servicos = require('../models/Projetos_servicos');
const Tarefas = require('../models/Tarefas');
const Faturas = require('../models/Faturas');
const Pagamentos = require('../models/Pagamentos');
const Documentos = require('../models/Documentos');

async function testDatabase() {
    try {
        console.log(' Testando conexão à base de dados...');
        
        // Testar conexão
        await sequelize.authenticate();
        console.log(' Conexão à base de dados estabelecida com sucesso!');

        // Definir associações
        console.log(' Definindo associações...');
        defineAssociations();
        console.log(' Associações definidas com sucesso!');

        // Sincronizar tabelas (força a recriação)
        console.log('Sincronizando tabelas...');
        await sequelize.sync({ force: true });
        console.log('Tabelas criadas com sucesso!');

        // Criar dados de teste
        console.log('Criando dados de teste...');
        
        // 1. Criar utilizador admin
        const admin = await Utilizador.create({
            username: 'admin',
            email: 'admin@portfolio.com',
            password: 'odracirladiv'
        });
        console.log(' Utilizador admin criado:', admin.username);

        // 2. Criar tipos de cliente
        const tipoParticular = await Tipos_Clientes.create({
            designacaoTipo_cliente: 'Particular'
        });
        
        const tipoEmpresa = await Tipos_Clientes.create({
            designacaoTipo_cliente: 'Empresa'
        });
        console.log('✅ Tipos de cliente criados');

        // 3. Criar estados de projeto
        const estadoIniciado = await Estados_Projeto.create({
            designacaoEstado_Projeto: 'Iniciado'
        });

        const estadoPendente = await Estados_Projeto.create({
            designacaoEstado_Projeto: 'Pendente'
        });
        
        const estadoEmAndamento = await Estados_Projeto.create({
            designacaoEstado_Projeto: 'Em Andamento'
        });
        
        const estadoConcluido = await Estados_Projeto.create({
            designacaoEstado_Projeto: 'Concluído'
        });
        
        const estadoDesativado = await Estados_Projeto.create({
            designacaoEstado_Projeto: 'Desativado'
        });
        console.log(' Estados de projeto criados');

        // 4. Criar tipos de serviço
        const tipoWebDev = await Tipos_Servicos.create({
            designacao: 'Desenvolvimento Web',
            descricao: 'Serviços de desenvolvimento de websites e aplicações web'
        });
        
        const tipoDesign = await Tipos_Servicos.create({
            designacao: 'Design Gráfico',
            descricao: 'Serviços de design gráfico e multimédia'
        });
        console.log(' Tipos de serviço criados');

        // 5. Criar cliente
        const cliente = await Clientes.create({
            nome: 'João Silva',
            email: 'joao@exemplo.com',
            telefone: '912345678',
            empresa: 'Empresa Exemplo Lda.',
            nif: '123456789',
            morada: 'Rua das Flores, 123, Viseu',
            notas: 'Cliente preferencial',
            ativo: true,
            idTipo_Cliente: tipoEmpresa.idTipo_Cliente
        });
        console.log(' Cliente criado:', cliente.nome);

        // 6. Criar serviços
        const servicoWeb = await Servicos.create({
            designacao_servico: 'Website Corporativo',
            descricao_Servico: 'Desenvolvimento de website corporativo responsivo',
            preco_base_servico: 1500.00,
            custo_servico: 800.00,
            horas_estimadas: 40,
            ativo: true,
            idTipo_Servico: tipoWebDev.idTipo_Servico
        });
        
        const servicoDesign = await Servicos.create({
            designacao_servico: 'Logótipo',
            descricao_Servico: 'Design de logótipo e identidade visual',
            preco_base_servico: 500.00,
            custo_servico: 200.00,
            horas_estimadas: 15,
            ativo: true,
            idTipo_Servico: tipoDesign.idTipo_Servico
        });
        console.log(' Serviços criados');

        // 7. Criar projeto
        const projeto = await Projetos.create({
            nomeProjeto: 'Website Empresa Exemplo',
            descricaoProjeto: 'Desenvolvimento de website corporativo com área de administração',
            dataInicio: new Date(),
            dataPrevista_Fim: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
            orcamentoTotal: 2000.00,
            notas: 'Projeto prioritário',
            ativo: true,
            idCliente: cliente.idCliente,
            idEstado_Projeto: estadoEmAndamento.idEstado_Projeto
        });
        console.log(' Projeto criado:', projeto.nomeProjeto);

        // 8. Associar serviços ao projeto
        await Projetos_Servicos.create({
            idProjeto: projeto.idProjeto,
            idServico: servicoWeb.idServico,
            quantidade: 1,
            preco_unitario: 1500.00,
            preco_total: 1500.00
        });
        
        await Projetos_Servicos.create({
            idProjeto: projeto.idProjeto,
            idServico: servicoDesign.idServico,
            quantidade: 1,
            preco_unitario: 500.00,
            preco_total: 500.00
        });
        console.log(' Serviços associados ao projeto');

        // 9. Criar tarefa
        const tarefa = await Tarefas.create({
            titulo_tarefa: 'Implementar página inicial',
            descricao: 'Desenvolver e implementar a página inicial do website',
            estado_tarefa: false,
            dataTermino_prevista: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 dias
            idProjeto: projeto.idProjeto
        });
        console.log(' Tarefa criada:', tarefa.titulo_tarefa);

        // 10. Criar fatura
        const fatura = await Faturas.create({
            numeroFatura: 'FAT-2024-001',
            dataEmissao: new Date(),
            dataVencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
            subTotal: 2000.00,
            taxa_iva: 23,
            valor_iva: 460.00,
            total_fatura: 2460.00,
            notas: 'Primeira fatura do projeto',
            idProjeto: projeto.idProjeto
        });
        console.log(' Fatura criada:', fatura.numeroFatura);

        // 11. Criar pagamento
        const pagamento = await Pagamentos.create({
            valorPagamento: 1230.00,
            dataPagamento: new Date(),
            metodo_pagamento: 'Transferência Bancária',
            notas: 'Pagamento de 50% da fatura',
            idFatura: fatura.idFatura
        });
        console.log(' Pagamento criado: €', pagamento.valorPagamento);

        // 12. Criar documentos
        const docProjeto = await Documentos.create({
            nome_ficheiro: 'briefing_projeto.pdf',
            caminho_ficheiro: '/docs/briefing_projeto.pdf',
            tipo_ficheiro: 'pdf',
            tipo_documento: 'briefing',
            descricao_documento: 'Briefing inicial do projeto',
            idProjeto: projeto.idProjeto
        });
        
        const docFatura = await Documentos.create({
            nome_ficheiro: 'fatura_001.pdf',
            caminho_ficheiro: '/docs/fatura_001.pdf',
            tipo_ficheiro: 'pdf',
            tipo_documento: 'fatura',
            descricao_documento: 'Fatura número 001',
            idProjeto: projeto.idProjeto,
            idFatura: fatura.idFatura
        });
        console.log('✅ Documentos criados');

        console.log('\n TESTE COMPLETO! Todos os dados foram criados com sucesso!');
        console.log('\n Resumo dos dados criados:');
        console.log(`- 1 utilizador (${admin.username})`);
        console.log(`- 2 tipos de cliente`);
        console.log(`- 4 estados de projeto`);
        console.log(`- 2 tipos de serviço`);
        console.log(`- 1 cliente (${cliente.nome})`);
        console.log(`- 2 serviços`);
        console.log(`- 1 projeto (${projeto.nomeProjeto})`);
        console.log(`- 2 associações projeto-serviço`);
        console.log(`- 1 tarefa`);
        console.log(`- 1 fatura (${fatura.numeroFatura})`);
        console.log(`- 1 pagamento`);
        console.log(`- 2 documentos`);

    } catch (error) {
        console.error(' Erro durante o teste:', error);
        console.error('Stack trace:', error.stack);
    } finally {
        await sequelize.close();
        console.log('\n Conexão à base de dados fechada.');
    }
}

// Executar o teste
testDatabase();
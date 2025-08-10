// debug-api.js - Script para testar a API em produção
// Cria este ficheiro na pasta backend/src/

require('dotenv').config();
const sequelize = require('./config/database');
const defineAssociations = require('./models/associations');

// Importar modelos
const Clientes = require('./models/Clientes');
const Tipos_Clientes = require('./models/Tipos_Clientes');
const Projetos = require('./models/Projetos');
const Estados_Projeto = require('./models/Estados_Projeto');

async function debugAPI() {
    try {
        console.log('🔍 INICIANDO DEBUG DA API...\n');
        
        // 1. Testar conexão à base de dados
        console.log('1️⃣ Testando conexão à base de dados...');
        await sequelize.authenticate();
        console.log('✅ Conexão estabelecida com sucesso!\n');
        
        // 2. Definir associações
        console.log('2️⃣ Definindo associações...');
        defineAssociations();
        console.log('✅ Associações definidas!\n');
        
        // 3. Testar tipos de cliente
        console.log('3️⃣ Testando tipos de cliente...');
        const tiposCliente = await Tipos_Clientes.findAll();
        console.log(`📊 Tipos de cliente encontrados: ${tiposCliente.length}`);
        tiposCliente.forEach(tipo => {
            console.log(`   - ${tipo.designacaoTipo_cliente} (ID: ${tipo.idTipo_Cliente})`);
        });
        console.log('');
        
        // 4. Testar clientes
        console.log('4️⃣ Testando clientes...');
        const clientesAll = await Clientes.findAll();
        const clientesAtivos = await Clientes.findAll({ where: { ativo: true } });
        
        console.log(`📊 Total de clientes: ${clientesAll.length}`);
        console.log(`📊 Clientes ativos: ${clientesAtivos.length}`);
        
        if (clientesAtivos.length > 0) {
            console.log('📋 Clientes ativos:');
            clientesAtivos.forEach(cliente => {
                console.log(`   - ${cliente.nome} (ID: ${cliente.idCliente}) - Ativo: ${cliente.ativo}`);
            });
        } else {
            console.log('⚠️  PROBLEMA: Nenhum cliente ativo encontrado!');
        }
        console.log('');
        
        // 5. Testar clientes com associações
        console.log('5️⃣ Testando clientes com tipos (como na API)...');
        const clientesComTipo = await Clientes.findAll({
            where: { ativo: true },
            include: [{
                model: Tipos_Clientes,
                as: "tipo"
            }]
        });
        
        console.log(`📊 Clientes com tipo encontrados: ${clientesComTipo.length}`);
        clientesComTipo.forEach(cliente => {
            console.log(`   - ${cliente.nome} - Tipo: ${cliente.tipo?.designacaoTipo_cliente || 'SEM TIPO'}`);
        });
        console.log('');
        
        // 6. Testar estados de projeto
        console.log('6️⃣ Testando estados de projeto...');
        const estadosProjeto = await Estados_Projeto.findAll();
        console.log(`📊 Estados de projeto encontrados: ${estadosProjeto.length}`);
        estadosProjeto.forEach(estado => {
            console.log(`   - ${estado.designacaoEstado_Projeto} (ID: ${estado.idEstado_Projeto})`);
        });
        console.log('');
        
        // 7. Testar projetos
        console.log('7️⃣ Testando projetos...');
        const projetosAll = await Projetos.findAll();
        const projetosAtivos = await Projetos.findAll({ where: { ativo: true } });
        
        console.log(`📊 Total de projetos: ${projetosAll.length}`);
        console.log(`📊 Projetos ativos: ${projetosAtivos.length}`);
        
        if (projetosAtivos.length > 0) {
            console.log('📋 Projetos ativos:');
            projetosAtivos.forEach(projeto => {
                console.log(`   - ${projeto.nomeProjeto} (ID: ${projeto.idProjeto}) - Cliente ID: ${projeto.idCliente}`);
            });
        }
        console.log('');
        
        // 8. Testar projetos com associações (como na API)
        console.log('8️⃣ Testando projetos com clientes e estados (como na API)...');
        const projetosComAssociacoes = await Projetos.findAll({
            include: [
                {
                    model: Clientes,
                    as: 'cliente',
                    where: { ativo: true },
                    required: false,
                    attributes: ['idCliente', 'nome', 'email', 'empresa']
                },
                {
                    model: Estados_Projeto,
                    as: 'estado',
                    attributes: ['idEstado_Projeto', 'designacaoEstado_Projeto']
                }
            ],
            order: [
                ['ativo', 'DESC'],
                ['createdAt', 'DESC']
            ]
        });
        
        console.log(`📊 Projetos com associações encontrados: ${projetosComAssociacoes.length}`);
        projetosComAssociacoes.forEach(projeto => {
            console.log(`   - Projeto: ${projeto.nomeProjeto}`);
            console.log(`     Cliente: ${projeto.cliente?.nome || '❌ CLIENTE NÃO ENCONTRADO'}`);
            console.log(`     Estado: ${projeto.estado?.designacaoEstado_Projeto || '❌ ESTADO NÃO ENCONTRADO'}`);
            console.log('');
        });
        
        // 9. Verificar problemas específicos
        console.log('9️⃣ Verificando problemas específicos...');
        
        const clientesInativos = await Clientes.findAll({ where: { ativo: false } });
        if (clientesInativos.length > 0) {
            console.log(`⚠️  ATENÇÃO: ${clientesInativos.length} clientes inativos encontrados:`);
            clientesInativos.forEach(cliente => {
                console.log(`   - ${cliente.nome} (ID: ${cliente.idCliente}) - Inativo`);
            });
        }
        
        const projetosSemCliente = await Projetos.findAll({
            where: { idCliente: null }
        });
        if (projetosSemCliente.length > 0) {
            console.log(`⚠️  ATENÇÃO: ${projetosSemCliente.length} projetos sem cliente:`);
            projetosSemCliente.forEach(projeto => {
                console.log(`   - ${projeto.nomeProjeto} (ID: ${projeto.idProjeto})`);
            });
        }
        
        console.log('\n✅ DEBUG CONCLUÍDO COM SUCESSO!');
        
    } catch (error) {
        console.error('❌ ERRO NO DEBUG:', error);
        console.error('Stack:', error.stack);
    } finally {
        process.exit(0);
    }
}

// Executar debug se o script for chamado diretamente
if (require.main === module) {
    debugAPI();
}

module.exports = debugAPI;
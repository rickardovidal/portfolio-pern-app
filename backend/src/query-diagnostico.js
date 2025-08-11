// query-diagnostico-corrigido.js - Com nomes corretos das tabelas
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false
});

async function diagnosticar() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conectado à base de dados\n');

    // 1. Listar todas as tabelas para confirmar nomes
    console.log('📋 TABELAS EXISTENTES:');
    const [tabelas] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    tabelas.forEach(t => console.log(`   - ${t.table_name}`));
    console.log('');

    // 2. Verificar clientes (com nome correto em minúsculas)
    console.log('1️⃣ CLIENTES:');
    const [clientes] = await sequelize.query(`
      SELECT 
        "idCliente", 
        nome, 
        ativo, 
        "idTipo_Cliente"
      FROM clientes 
      ORDER BY nome 
      LIMIT 10
    `);
    
    console.log(`📊 Total encontrados: ${clientes.length}`);
    clientes.forEach(c => {
      console.log(`   - ${c.nome} (ID: ${c.idCliente}, Ativo: ${c.ativo})`);
    });
    console.log('');

    // 3. Verificar projetos (com nome correto em minúsculas)
    console.log('2️⃣ PROJETOS:');
    const [projetos] = await sequelize.query(`
      SELECT 
        "idProjeto", 
        "nomeProjeto", 
        "idCliente", 
        ativo
      FROM projetos 
      ORDER BY "createdAt" DESC
      LIMIT 10
    `);
    
    console.log(`📊 Total encontrados: ${projetos.length}`);
    projetos.forEach(p => {
      console.log(`   - ${p.nomeProjeto} (Cliente ID: ${p.idCliente}, Ativo: ${p.ativo})`);
    });
    console.log('');

    // 4. JOIN entre projetos e clientes (o problema que precisamos resolver)
    console.log('3️⃣ JOIN PROJETOS + CLIENTES:');
    const [projetosComClientes] = await sequelize.query(`
      SELECT 
        p."nomeProjeto",
        p."idCliente" as projeto_cliente_id,
        c.nome as cliente_nome,
        c.ativo as cliente_ativo
      FROM projetos p
      LEFT JOIN clientes c ON p."idCliente" = c."idCliente"
      ORDER BY p."createdAt" DESC
      LIMIT 10
    `);
    
    console.log(`📊 JOIN encontrados: ${projetosComClientes.length}`);
    projetosComClientes.forEach(p => {
      const status = p.cliente_nome ? '✅' : '❌';
      console.log(`   ${status} ${p.nomeProjeto} → ${p.cliente_nome || 'SEM CLIENTE'}`);
    });

    console.log('\n🎯 CONCLUSÃO:');
    console.log('Se vir dados aqui, o problema é mesmo os nomes das tabelas no Sequelize!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    process.exit(0);
  }
}

diagnosticar();
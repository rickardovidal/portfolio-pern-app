// Migração one-off: adiciona horasEstimadas e custoHora à tabela projetos.
// Idempotente (ADD COLUMN IF NOT EXISTS) — correr mais de uma vez é inofensivo.
// Uso: node scripts/add-horas-projeto.js
require('dotenv').config();
const sequelize = require('../src/config/database');

async function migrar() {
    try {
        await sequelize.authenticate();
        console.log('Ligado à base de dados.');

        await sequelize.query('ALTER TABLE projetos ADD COLUMN IF NOT EXISTS "horasEstimadas" INTEGER;');
        await sequelize.query('ALTER TABLE projetos ADD COLUMN IF NOT EXISTS "custoHora" DECIMAL(10,2);');
        console.log('Colunas garantidas.');

        const [colunas] = await sequelize.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'projetos' AND column_name IN ('horasEstimadas', 'custoHora')
            ORDER BY column_name;
        `);
        console.table(colunas);

        if (colunas.length !== 2) {
            throw new Error(`Esperava 2 colunas, encontrei ${colunas.length}`);
        }
        console.log('Migração concluída com sucesso.');
    } finally {
        await sequelize.close();
    }
}

migrar().catch((err) => {
    console.error('Migração falhou:', err.message);
    process.exit(1);
});

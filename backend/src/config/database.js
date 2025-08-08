// Carregar variáveis de ambiente PRIMEIRO
require('dotenv').config();
var Sequelize = require('sequelize');

// Detectar se estamos em ambiente de produção ou desenvolvimento
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;

let sequelize;

if (isProduction && process.env.DATABASE_URL) {
    // CONFIGURAÇÃO PARA PRODUÇÃO (Render)
    // Usar a DATABASE_URL completa fornecida pelo Render
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        logging: false, // Desactivar logs SQL em produção para performance
        
        // Configurações SSL obrigatórias para o Render
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Necessário para alguns fornecedores de hosting
            }
        },
        
        // Configurações de pool de conexões para produção
        pool: {
            max: 5,     // Máximo de 5 conexões simultâneas
            min: 0,     // Mínimo de 0 conexões quando não há tráfego
            acquire: 30000,  // Tempo máximo para obter conexão (30 segundos)
            idle: 10000      // Tempo que conexão pode ficar inactiva (10 segundos)
        }
    });
} else {
    // CONFIGURAÇÃO PARA DESENVOLVIMENTO LOCAL
    // Usar parâmetros individuais como antes
    sequelize = new Sequelize(
        process.env.DB_NAME || 'portfolio',
        process.env.DB_USER || 'postgres', 
        process.env.DB_PASS || '12345',
        {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || '5432',
            dialect: 'postgres',
            logging: false, // Podes activar com 'console.log' para debug local
            
            // Em desenvolvimento local, SSL normalmente não é necessário
            dialectOptions: {},
            
            // Pool mais simples para desenvolvimento
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
}

// Exportar a instância configurada
module.exports = sequelize;
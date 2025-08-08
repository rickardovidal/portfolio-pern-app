require('dotenv').config(); // Carregar variáveis de ambiente
var Sequelize = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'portfolio',
    process.env.DB_USER || 'postgres', 
    process.env.DB_PASS || '12345',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        dialect: 'postgres',
        logging: false,
    }
);

module.exports = sequelize;
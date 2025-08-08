var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Faturas = sequelize.define('faturas', {
    idFatura: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numeroFatura: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    dataEmissao: {
        type: Sequelize.DATE,
        allowNull: false
    },
    dataVencimento: {
        type: Sequelize.DATE,
        allowNull: false
    },
    subTotal: {
        type: Sequelize.DECIMAL,
        allowNull: false
        //adicionar validacoes e formatacoes
    },
    taxa_iva: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    valor_iva: {
        type: Sequelize.DECIMAL,
        allowNull: true
    },
    total_fatura: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    notas: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    idProjeto: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'projetos',
                key: 'idProjeto'
            }
           }
    
},
{

timestamps: true,
tableName: "faturas"


});

module.exports = Faturas;
var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Pagamentos = sequelize.define('pagamentos', {
    idPagamento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    valorPagamento: {
        type: Sequelize.DECIMAL, //ver se é necessária formatacao
        allowNull: false
    },
    dataPagamento: {
        type: Sequelize.DATE,
        allowNull: false
    },
    metodo_pagamento: {
        type: Sequelize.STRING,
        allowNull: true
    },
    notas: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    idFatura: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'faturas',
            key: 'idFatura'
        }
    }
}, {
    timestamps: true,
    tableName: 'pagamentos'

});

module.exports = Pagamentos;
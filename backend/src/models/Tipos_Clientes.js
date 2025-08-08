var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Tipos_Clientes = sequelize.define('tipos_clientes', {
    idTipo_Cliente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    //particular, empresa...
    designacaoTipo_cliente: {
        type: Sequelize.STRING,
        allowNull: false
        //adicionar indice unique
    }
}, {
    timestamps: true,
    tableName: "tipos_clientes"
    
})

module.exports = Tipos_Clientes;


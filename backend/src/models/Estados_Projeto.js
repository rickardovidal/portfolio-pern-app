var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Estados_Projeto = sequelize.define('estados_projeto', {
    idEstado_Projeto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    designacaoEstado_Projeto: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
        //adicionar indice unique
    }
},
{

    tableName: "estados_projeto"
});

module.exports = Estados_Projeto;
var Sequelize = require ('sequelize');
var sequelize = require ('../config/database');

var Tipos_Servicos = sequelize.define('tipos_servicos', {
    idTipo_Servico: { 
        type: Sequelize.INTEGER,
        primaryKey: true, 
        autoIncrement: true,
    },
    designacao: {
        type: Sequelize.STRING,
        allowNull: false,
        len: [2, 100]
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    }
},
    {

        timestamps: true,
        tableName: "tipos_servicos",

});

module.exports = Tipos_Servicos;
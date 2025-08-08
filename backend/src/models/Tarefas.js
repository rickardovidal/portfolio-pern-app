var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Tarefas = sequelize.define('tarefas', {
    idTarefa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo_tarefa: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao: {
        type: Sequelize.TEXT,
        allowNull: true
    },
   estado_tarefa: {
    type: Sequelize.BOOLEAN,
    allowNull: false
   },
   dataTermino_prevista: {
    type: Sequelize.DATE,
    allowNull: true
   },
   dataTermino: {
    type: Sequelize.DATE,
    allowNull: true
   },
   //chave estrangeira
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
    tableName: "tarefas"
});

module.exports = Tarefas;
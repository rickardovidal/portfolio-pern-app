var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Projetos_Servicos = sequelize.define('projetos_servicos', {
    idProjeto_Servico: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    //chaves estrangeiras
    idProjeto: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'projetos',
            key: 'idProjeto'
        }
    },
    idServico: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'servicos',
            key: 'idServico'
        }
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 1,
        validate: {
            min: 1,
            isInt: true
        }
    },
    preco_unitario: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true
        }
    },
     preco_total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
},
   { 
    timestamps: true,
    tableName: "projetos_servicos"

   
});

module.exports = Projetos_Servicos;
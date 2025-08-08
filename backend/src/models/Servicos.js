var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Servicos = sequelize.define('servicos', {
    idServico: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    designacao_servico: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 200]
        }
        
    },
    descricao_Servico: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    preco_base_servico: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true
        }
    },
    custo_servico: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true
        }
    },
    horas_estimadas: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            isInt: true
        }
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: true
    },
    //chave estrangeira
    idTipo_Servico: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'tipos_servicos',
            key: 'idTipo_Servico'
        }
    }
},
{
    timestamps: true,
    tableName: "servicos",

});

module.exports = Servicos;
var Sequelize = require('sequelize')
var sequelize = require('../config/database')

var Projetos = sequelize.define('projetos', {
    idProjeto: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomeProjeto: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 200]
        }
    },
    descricaoProjeto: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    dataInicio: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    dataPrevista_Fim: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    dataFim: {
        type: Sequelize.DATE,
        allowNull: true,
        validate: {
            isDate: true
        }

    },
    orcamentoTotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
            isDecimal: true,
            notEmpty: true
        }
    },
    horasEstimadas: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            isInt: true
        }
    },
    custoHora: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0,
            isDecimal: true
        }
    },
    horasExtra: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
            isInt: true
        }
    },
    // Se false, o orçamento é recalculado a partir do preço atual dos serviços sempre que o projeto é consultado.
    // Se true, o orçamento foi ajustado manualmente e fica fixo até o utilizador voltar a editá-lo.
    orcamentoManual: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    //ver se este campo ainda faz sentido tendo em conta os estados do projeto
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: true
    },
    notas: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    idCliente: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
            model: 'clientes',
            key: 'idCliente'
        }
    },
     idEstado_Projeto: {
        type: Sequelize.INTEGER, 
        allowNull: false,
        references: {
            model: 'estados_projeto',
            key: 'idEstado_Projeto'
        }
    },
}, {
    timestamps: true,
    tableName: "projetos"

})

module.exports = Projetos;
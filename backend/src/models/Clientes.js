var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Clientes = sequelize.define('clientes', {
    idCliente: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 100]
        }
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    telefone: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
        len: [9, 20], // Mantém o comprimento flexível
        isValidPhone(value) {
            if (value && value.trim() !== '') {
                // Regex para números portugueses (móveis e fixos)
                const phoneRegex = /^(\+351\s?)?[2-9]\d{8}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    throw new Error('Formato de telefone inválido. Use o formato português (ex: 912345678 ou +351912345678)');
                }
            }
        }
    }
},
    empresa: {
        type: Sequelize.STRING,
        allowNull: true
    },
    nif: {
        type: Sequelize.STRING(9),
        allowNull: true,
        validate: {
            len: [9,9],
            isNumeric: true
        }
    },
    morada: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    notas: {
        type: Sequelize.STRING,
        allowNull: true
    },
    ativo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: true
    },
    //chave estrangeira
    idTipo_Cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'tipos_clientes',
            key: 'idTipo_Cliente'
        }
    }
}, {

    timestamps: true,
    tableName: 'clientes'

});

module.exports = Clientes;
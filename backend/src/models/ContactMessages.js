// src/models/ContactMessages.js
var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var ContactMessages = sequelize.define('contact_messages', {
    idContactMessage: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O nome é obrigatório'
            },
            len: {
                args: [2, 100],
                msg: 'Nome deve ter entre 2 e 100 caracteres'
            }
        }
    },
    email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O email é obrigatório'
            },
            isEmail: {
                msg: 'Formato de email inválido'
            }
        }
    },
    telefone: {
        type: Sequelize.STRING(20),
        allowNull: true,
        validate: {
            len: {
                args: [0, 20],
                msg: 'Telefone não pode ter mais de 20 caracteres'
            }
        }
    },
    empresa: {
        type: Sequelize.STRING(100),
        allowNull: true,
        validate: {
            len: {
                args: [0, 100],
                msg: 'Nome da empresa não pode ter mais de 100 caracteres'
            }
        }
    },
    assunto: {
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'O assunto é obrigatório'
            },
            len: {
                args: [5, 200],
                msg: 'Assunto deve ter entre 5 e 200 caracteres'
            }
        }
    },
    mensagem: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'A mensagem é obrigatória'
            },
            len: {
                args: [10, 2000],
                msg: 'Mensagem deve ter entre 10 e 2000 caracteres'
            }
        }
    },
    status: {
        type: Sequelize.ENUM('novo', 'lido', 'respondido', 'arquivado'),
        defaultValue: 'novo',
        allowNull: false
    },
    ip_address: {
        type: Sequelize.STRING(45),
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: "contact_messages",
    hooks: {
        beforeCreate: (contactMessage, options) => {
            // Limpar espaços em branco
            if (contactMessage.nome) contactMessage.nome = contactMessage.nome.trim();
            if (contactMessage.email) contactMessage.email = contactMessage.email.trim().toLowerCase();
            if (contactMessage.telefone) contactMessage.telefone = contactMessage.telefone.trim();
            if (contactMessage.empresa) contactMessage.empresa = contactMessage.empresa.trim();
            if (contactMessage.assunto) contactMessage.assunto = contactMessage.assunto.trim();
            if (contactMessage.mensagem) contactMessage.mensagem = contactMessage.mensagem.trim();
        }
    }
});

module.exports = ContactMessages;
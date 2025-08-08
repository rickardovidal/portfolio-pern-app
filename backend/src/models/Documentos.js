var Sequelize = require('sequelize');
var sequelize = require('../config/database');

var Documentos = sequelize.define('documentos', {
    idDocumento: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_ficheiro: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    caminho_ficheiro: {
        type: Sequelize.STRING,
        allowNull: true
    },
    tipo_ficheiro: {
        //.pdf, .docx, .clsx
        type: Sequelize.STRING,
        allowNull: true
    },
    tipo_documento: {
        //fatura, recibo, briefieng
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao_documento: {
        type: Sequelize.TEXT,
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
       },
       idFatura: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'faturas',
            key: 'idFatura'
        }
       }
},
{
  timestamps: true,
  tableName: "documentos"
    
});

module.exports = Documentos;
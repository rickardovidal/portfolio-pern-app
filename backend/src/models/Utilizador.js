var Sequelize = require('sequelize');
var sequelize = require('../config/database');
const bcrypt = require('bcrypt');

var Utilizador = sequelize.define('utilizador', {
    idUtilizador: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,

    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            len: [2, 100]
        },
       
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },

    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [6, 255]
        },
         set(value) {
            // Encripta a password antes de guardar
            const hash = bcrypt.hashSync(value, 10);
            this.setDataValue('password', hash);
        }
    },
},
    {
        timestamps: true,
        tablename: "utilizador",
    }
);
// Método para verificar passwords
Utilizador.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = Utilizador;
const Sequelize = require("sequelize");

const connection = new Sequelize("perguntas", "root", "Caique17242630", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection;
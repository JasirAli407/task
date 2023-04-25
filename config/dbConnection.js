const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('MyStore', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;

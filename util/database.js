const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'minh', 'minh123', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
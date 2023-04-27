const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConnection');
// const { Item } = require('./');
const Sale = sequelize.define('Sale', {
    sale_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, allowNull: false },
    // item_id: { type: DataTypes.INTEGER, references: { model: Items, key: 'item_id' } },
    item_name: { type: DataTypes.STRING },
    date: { type: DataTypes.DATEONLY },
    quantity: { type: DataTypes.INTEGER },
    total_price: { type: DataTypes.FLOAT }
});



module.exports = Sale;


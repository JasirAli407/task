// const Item = require('./itemModel');
const sequelize = require('../config/dbConnection');
const Sale = require('./saleModel');

// Item.hasMany(Sale);
// Sale.belongsTo(Item);

sequelize.sync(
    // {force : true}
    );

module.exports = { 
    // Item,
     Sale };
const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
});

// sequelize.sync().then(() => {
//   console.log('synced')
// }).catch(err => console.log(err))
module.exports = sequelize;
global.sequelize = sequelize;
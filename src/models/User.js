const Sequelize = require('sequelize');
const sequelize = require('../database/db')


module.exports = sequelize.define('User',
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    first_name: { type: Sequelize.STRING(255),allowNull: true },
    last_name: { type: Sequelize.STRING(255),allowNull: true },
    email: { type: Sequelize.STRING(255),allowNull: true, unique: true },
    password: { type: Sequelize.STRING(255), allowNull: true },
  },
  {
    defaultScope: {
      // exclude password hash by default
      attributes: { exclude: ['password'] }
    },
    scopes: {
      // include hash with this scope
      withHash: { attributes: {}, }
    },
    // freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
); 

const Sequelize = require('sequelize');
const Guardian = require('./Guardian');


module.exports = sequelize.define('Student',
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
    guardian_id: {
      type: Sequelize.INTEGER,
      references: {
        model: Guardian,
        key: 'id',
      }
    }
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
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
); 

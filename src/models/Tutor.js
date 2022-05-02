const Sequelize = require('sequelize');


module.exports = sequelize.define('Tutor',
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
    password: { type: Sequelize.STRING(255),allowNull: true },
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
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
); 

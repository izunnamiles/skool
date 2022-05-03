const Sequelize = require('sequelize');

module.exports = sequelize.define('Department',
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: { type: Sequelize.STRING(255),allowNull: true },
    description: { type: Sequelize.STRING(255),allowNull: true },
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
); 

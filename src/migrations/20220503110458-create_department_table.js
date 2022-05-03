'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('departments',
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
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('departments');
  }
};

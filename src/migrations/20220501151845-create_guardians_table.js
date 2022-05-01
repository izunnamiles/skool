'use strict';

const Student = require("../models/Student");

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('guardians', {
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
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('guardians');
  }
};
this.hasMany(Student, {as: "ward", foreignKey: 'guardian_id'})
'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('department_tutors', {
      id: Sequelize.INTEGER(11),
      department_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: {
            tableName: 'departments',
          },
          key: 'id'
        },
        allowNull: false
      },
      tutor_id: {
        type: Sequelize.INTEGER(11),
        references: {
          model: {
            tableName: 'tutors',
          },
          key: 'id'
        },
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('department_tutors');
  }
};

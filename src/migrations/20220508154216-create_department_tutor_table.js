'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('department_tutors', {
      id: Sequelize.INTEGER,
      department_id: {
        type: Sequelize.INTEGER,
        references: {
          model: Department,
          key: 'id'
        }
      },
      tutor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: Tutor, 
          key: 'id'
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('department_tutors');
  }
};

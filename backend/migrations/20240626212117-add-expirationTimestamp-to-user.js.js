'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'expirationTimestamp', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Users', 'expirationTimestamp', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

  }
};

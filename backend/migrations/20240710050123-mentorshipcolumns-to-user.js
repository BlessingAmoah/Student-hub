'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'note', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Users', 'status', {
      type: Sequelize.ENUM('accepted', 'rejected', 'requested'),
      defaultValue: 'none',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'note');
   // await queryInterface.removeColumn('Users', 'status');
  }
};

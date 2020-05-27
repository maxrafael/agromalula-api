module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('matrices', 'sync', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('matrices', 'sync');
  },
};

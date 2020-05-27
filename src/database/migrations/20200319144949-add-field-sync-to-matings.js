module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('matings', 'sync', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('matings', 'sync');
  },
};

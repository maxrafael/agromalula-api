module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('bulls', 'sync', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('bulls', 'sync');
  },
};

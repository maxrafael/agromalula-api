module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('matings', 'date', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('matings', 'date');
  },
};

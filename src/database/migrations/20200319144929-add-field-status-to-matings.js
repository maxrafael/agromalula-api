module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('matings', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'ativo',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('matings', 'status');
  },
};

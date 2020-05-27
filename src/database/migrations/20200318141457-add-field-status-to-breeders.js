module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('breeders', 'status', {
      type: Sequelize.STRING,
      defaultValue: 'ativo',
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('breeders', 'status');
  },
};

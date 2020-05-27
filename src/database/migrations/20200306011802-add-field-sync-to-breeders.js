module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('breeders', 'sync', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('breeders', 'sync');
  },
};

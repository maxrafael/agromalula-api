module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('files', 'size', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('files', 'size');
  },
};

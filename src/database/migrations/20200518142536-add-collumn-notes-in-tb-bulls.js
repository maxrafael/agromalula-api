module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('bulls', 'notes', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('bulls', 'notes');
  },
};

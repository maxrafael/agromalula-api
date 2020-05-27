module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('bulls', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('bulls', 'price');
  },
};

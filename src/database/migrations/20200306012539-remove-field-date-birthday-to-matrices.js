module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('matrices', 'date_birth');
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('matrices', 'date_birth', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },
};

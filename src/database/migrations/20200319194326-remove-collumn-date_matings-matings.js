module.exports = {
  up: queryInterface => {
    return queryInterface.removeColumn('matings', 'date_mating');
  },
};

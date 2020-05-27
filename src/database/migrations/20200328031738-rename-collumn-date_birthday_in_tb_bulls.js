module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('bulls', 'date_birth', 'birthday');
  },
};

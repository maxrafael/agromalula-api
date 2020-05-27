module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('matings', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      matrix_id: {
        type: Sequelize.INTEGER,
        references: { model: 'matrices', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      first_option_id: {
        type: Sequelize.INTEGER,
        references: { model: 'breeders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      second_option_id: {
        type: Sequelize.INTEGER,
        references: { model: 'breeders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('matings');
  },
};

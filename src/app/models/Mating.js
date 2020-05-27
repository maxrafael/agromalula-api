import Sequelize, { Model } from 'sequelize';

class Mating extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        status: Sequelize.STRING,
        sync: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Matrix, { foreignKey: 'matrix_id', as: 'matrix' });
    this.belongsTo(models.Breeder, {
      foreignKey: 'first_option_id',
      as: 'first_option',
    });
    this.belongsTo(models.Breeder, {
      foreignKey: 'second_option_id',
      as: 'second_option',
    });
  }
}

export default Mating;

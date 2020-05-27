import Sequelize, { Model } from 'sequelize';

class Matrix extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        status: Sequelize.STRING,
        sync: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Matrix;

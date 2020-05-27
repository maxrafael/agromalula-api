import Sequelize, { Model } from 'sequelize';

class Breeder extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        dose: Sequelize.INTEGER,
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

export default Breeder;

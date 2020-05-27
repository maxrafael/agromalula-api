import Sequelize, { Model } from 'sequelize';

class Bull extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        birthday: Sequelize.DATE,
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

export default Bull;

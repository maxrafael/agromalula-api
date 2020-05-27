import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Breeder from '../app/models/Breeder';
import Matrix from '../app/models/Matrix';
import Mating from '../app/models/Mating';
import Bull from '../app/models/Bull';

import databaseConfig from '../config/database';

const models = [User, File, Breeder, Matrix, Mating, Bull];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();

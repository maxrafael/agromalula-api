import * as Yup from 'yup';
import { Op } from 'sequelize';
import Mating from '../models/Mating';
import Matrix from '../models/Matrix';
import Breeder from '../models/Breeder';

class MatingController {
  async index(req, res) {
    const { page, search, id, sync } = req.query;

    const where = search ? { name: { [Op.iLike]: `%${search}%` } } : {};

    const include = [
      {
        model: Matrix,
        as: 'matrix',
        attributes: ['id', 'name'],
        where,
      },
      {
        model: Breeder,
        as: 'first_option',
        attributes: ['id', 'name'],
      },
      {
        model: Breeder,
        as: 'second_option',
        attributes: ['id', 'name'],
      },
    ];

    if (id) {
      const loadRecord = await Mating.findByPk(id, {
        include,
      });
      return res.json(loadRecord);
    }

    if (sync) {
      const loadRecord = await Mating.findAndCountAll({
        where: { sync: { [Op.not]: true } },
      });
      return res.json(loadRecord);
    }

    if (page) {
      const limitView = 5;

      const matings = await Mating.findAll({
        order: ['date'],
        limit: limitView,
        attributes: ['id', 'date'],
        offset: (page - 1) * limitView,
        where: { status: { [Op.ne]: 'deleted' } },
        include,
      });

      const Count = await Mating.count({ include });
      const lastPage = page * limitView >= Count;

      return res.json({ lastPage, content: matings });
    }

    const matings = await Mating.findAll({
      attributes: ['id', 'date'],
      include,
      where: { status: { [Op.ne]: 'deleted' } },
    });

    return res.json(matings);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      matrix_id: Yup.number().required(),
      first_option_id: Yup.number().required(),
      second_option_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const matingExists = await Mating.findOne({
      where: {
        [Op.and]: [{ matrix_id: req.body.matrix_id }, { date: req.body.date }],
        status: { [Op.ne]: 'deleted' },
      },
    });

    if (matingExists) {
      return res
        .status(400)
        .json({ error: 'Já existe acasalamento pra a Matriz nesta data.' });
    }

    const { id, first_option_id, second_option_id, date } = await Mating.create(
      req.body
    );

    return res.json({
      id,
      first_option_id,
      second_option_id,
      date,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      matrix_id: Yup.number(),
      first_option_id: Yup.number(),
      second_option_id: Yup.number(),
      date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const {
      matrix_id,
      first_option_id,
      second_option_id,
      date,
      status,
      sync,
    } = req.body;

    const mating = await Mating.findByPk(req.params.id);

    if (matrix_id !== mating.matrix_id && date !== mating.date) {
      const matingExists = await Mating.findOne({
        where: {
          [Op.and]: [
            { matrix_id: req.body.matrix_id },
            { date: req.body.date },
          ],
        },
      });

      if (matingExists) {
        return res
          .status(400)
          .json({ error: 'Já existe acasalamento pra a Matriz nesta data.' });
      }
    }

    const { id } = await mating.update(req.body);

    return res.json({
      id,
      matrix_id,
      first_option_id,
      second_option_id,
      date,
      status,
      sync,
    });
  }

  async delete(req, res) {
    const mating = await Mating.findByPk(req.params.id);

    await mating.destroy(mating.id);

    return res.json({ success: 'Acasalamento deletado.' });
  }
}

export default new MatingController();

import * as Yup from 'yup';
import { Op } from 'sequelize';
import Bull from '../models/Bull';

class BullController {
  async index(req, res) {
    const { page, search, id, sync, status } = req.query;

    if (id) {
      const loadRecord = await Bull.findByPk(id);
      return res.json(loadRecord);
    }

    if (sync) {
      const loadRecord = await Bull.findAndCountAll({
        where: { sync: { [Op.not]: true } },
        order: ['name'],
      });
      return res.json(loadRecord);
    }

    if (status) {
      const loadRecord = await Bull.findAll({
        where: { status: { [Op.eq]: `${status}` } },
        order: ['name'],
      });
      return res.json(loadRecord);
    }

    const where = search
      ? { name: { [Op.iLike]: `%${search}%` }, status: { [Op.ne]: 'deleted' } }
      : { status: { [Op.ne]: 'deleted' } };

    if (page) {
      const limitView = 10;

      const bulls = await Bull.findAndCountAll({
        where,
        order: ['name'],
        attributes: ['id', 'name', 'birthday', 'status'],
        limit: limitView,
        offset: (page - 1) * limitView,
      });

      const Count = await Bull.count({ where });
      const lastPage = page * limitView >= Count;

      return res.json({ lastPage, content: bulls });
    }

    const bulls = await Bull.findAndCountAll({ where });

    return res.json(bulls);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      birthday: Yup.date().required(),
      status: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const bullExists = await Bull.findOne({
      where: { name: req.body.name },
    });

    if (bullExists) {
      return res.status(400).json({ error: 'Touro já cadastrado.' });
    }

    const { id, name, birthday, status } = await Bull.create(req.body);

    return res.json({
      id,
      name,
      birthday,
      status,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      birthday: Yup.date(),
      status: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name, birthday, status } = req.body;

    const bull = await Bull.findByPk(req.params.id);

    if (name && name !== bull.name) {
      const bullExists = await Bull.findOne({
        where: { name: req.body.name },
      });

      if (bullExists) {
        return res
          .status(400)
          .json({ error: 'Touro já cadastrado com esse registro.' });
      }
    }

    const { id } = await bull.update(req.body);

    return res.json({
      id,
      name,
      birthday,
      status,
    });
  }

  async delete(req, res) {
    const bull = await Bull.findByPk(req.params.id);

    await bull.destroy(bull.id);

    return res.json({ success: 'Touro deletado.' });
  }
}

export default new BullController();

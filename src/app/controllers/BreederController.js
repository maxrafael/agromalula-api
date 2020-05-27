import * as Yup from 'yup';
import { Op } from 'sequelize';
import Breeder from '../models/Breeder';

class BreederController {
  async index(req, res) {
    const { page, search, id, status, dose, sync } = req.query;

    if (id) {
      const loadRecord = await Breeder.findByPk(id);
      return res.json(loadRecord);
    }

    if (sync) {
      const loadRecord = await Breeder.findAndCountAll({
        where: { sync: { [Op.not]: true } },
        order: ['name'],
      });
      return res.json(loadRecord);
    }

    if (dose) {
      const loadRecord = await Breeder.findAll({
        where: { dose: { [Op.gt]: `${dose}` } },
        order: ['name'],
      });
      return res.json(loadRecord);
    }

    if (status) {
      const loadRecord = await Breeder.findAll({
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

      const breeders = await Breeder.findAndCountAll({
        where,
        order: ['name'],
        attributes: ['id', 'name', 'dose', 'status', 'sync'],
        limit: limitView,
        offset: (page - 1) * limitView,
      });

      const Count = await Breeder.count({ where });
      const lastPage = page * limitView >= Count;

      return res.json({ lastPage, content: breeders });
    }
    const breeders = await Breeder.findAndCountAll({ where });

    return res.json(breeders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      dose: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const breederExists = await Breeder.findOne({
      where: { name: req.body.name, status: { [Op.ne]: 'deleted' } },
    });

    if (breederExists) {
      return res.status(400).json({ error: 'Reprodutor já cadastrado.' });
    }

    const { id, name, dose } = await Breeder.create(req.body);

    return res.json({
      id,
      name,
      dose,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      dose: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name, dose } = req.body;

    const breeder = await Breeder.findByPk(req.params.id);

    if (name && name !== breeder.name) {
      const breederExists = await Breeder.findOne({
        where: { name: req.body.name },
      });

      if (breederExists) {
        return res
          .status(400)
          .json({ error: 'Reprodutor já cadastrado com esse nome.' });
      }
    }

    const { id } = await breeder.update(req.body);

    return res.json({
      id,
      name,
      dose,
    });
  }

  async delete(req, res) {
    const breeder = await Breeder.findByPk(req.params.id);

    await breeder.destroy(breeder.id);

    return res.json({ success: 'Reprodutor deletado.' });
  }
}

export default new BreederController();

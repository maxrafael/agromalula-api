import * as Yup from 'yup';
import { Op } from 'sequelize';
import Matrix from '../models/Matrix';

class MatrixController {
  async index(req, res) {
    const { page, search, id, status, sync } = req.query;

    if (id) {
      const loadRecord = await Matrix.findByPk(id);
      return res.json(loadRecord);
    }

    if (sync) {
      const loadRecord = await Matrix.findAndCountAll({
        where: { sync: { [Op.not]: true } },
        order: ['name'],
      });
      return res.json(loadRecord);
    }

    if (status) {
      const loadRecord = await Matrix.findAll({
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

      const matrices = await Matrix.findAndCountAll({
        where,
        order: ['name'],
        attributes: ['id', 'name', 'status', 'sync'],
        limit: limitView,
        offset: (page - 1) * limitView,
      });

      const Count = await Matrix.count({ where });
      const lastPage = page * limitView >= Count;

      return res.json({ lastPage, content: matrices });
    }
    const matrices = await Matrix.findAndCountAll({ where });

    return res.json({ content: matrices });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      status: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const matrixExists = await Matrix.findOne({
      where: { name: req.body.name, status: { [Op.ne]: 'deleted' } },
    });

    if (matrixExists) {
      return res.status(400).json({ error: 'Matriz já cadastrada.' });
    }

    const { id, name, status } = await Matrix.create(req.body);

    return res.json({
      id,
      name,
      status,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      status: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { name, status } = req.body;

    const matrix = await Matrix.findByPk(req.params.id);

    if (name && name !== matrix.name) {
      const matrixExists = await Matrix.findOne({
        where: { name: req.body.name },
      });

      if (matrixExists) {
        return res
          .status(400)
          .json({ error: 'Matrix já cadastrada com esse registro.' });
      }
    }

    const { id } = await matrix.update(req.body);

    return res.json({
      id,
      name,
      status,
    });
  }

  async delete(req, res) {
    const matrix = await Matrix.findByPk(req.params.id);

    await matrix.destroy(matrix.id);

    return res.json({ success: 'Matriz deletada.' });
  }
}

export default new MatrixController();

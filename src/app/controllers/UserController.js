import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      user_name: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const userExists = await User.findOne({
      where: { user_name: req.body.user_name },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existente.' });
    }

    const { id, name, user_name, administrator } = await User.create(req.body);

    return res.json({ id, name, user_name, administrator });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      user_name: Yup.string(),
      oldPassword: Yup.string(),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { user_name, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (user_name && user_name !== user.user_name) {
      const userExists = await User.findOne({
        where: { user_name },
      });

      if (userExists) {
        return res.status(400).json({ error: 'Nome de usuário já utilizado.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha antiga não confere.' });
    }

    const { id, name, administrator } = await user.update(req.body);

    return res.json({ id, name, user_name, administrator });
  }
}

export default new UserController();

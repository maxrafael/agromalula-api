import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      user_name: Yup.string().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { user_name, password } = req.body;

    const user = await User.findOne({ where: { user_name } });

    if (!user) {
      return res.status(400).json({ erro: 'Usuário não cadastrado.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Senha não confere.' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        user_name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();

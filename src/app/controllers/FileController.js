import File from '../models/File';

class FileController {
  async index(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Arquivos não encontrados.' });
    }

    const files = await File.findAll({
      where: {
        bull_id: `${id}`,
      },
    });

    return res.json(files);
  }

  async store(req, res) {
    const { originalname: name, filename: path, size } = req.file;

    const bull_id = req.params.id;

    const file = await File.create({
      name,
      path,
      bull_id,
      size,
    });

    return res.json(file);
  }

  async delete(req, res) {
    const file = await File.findByPk(req.params.id);

    await file.destroy(file.id);

    return res.json({ success: 'Arquivo deletado.' });
  }
}

export default new FileController();

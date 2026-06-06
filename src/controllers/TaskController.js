const Task = require('../models/Task');

module.exports = {
  // Criar uma nova tarefa
  async store(req, res) {
    try {
      const { title, description, importance, date } = req.body;
      
      // O userId virá do middleware de autenticação (JWT)
      const task = await Task.create({
        title,
        description,
        importance,
        date,
        user: req.userId 
      });

      return res.status(201).json(task);
    } catch (err) {
      return res.status(400).json({ error: 'Erro ao criar tarefa' });
    }
  },

  // Listagem com Filtros Avançados (Data, Título, Descrição, Importância)
  async index(req, res) {
    try {
      const { title, description, importance, startDate, endDate } = req.query;
      let filters = { user: req.userId }; // Filtra sempre pelo usuário logado

      // Filtro por Título (Busca parcial com Case Insensitive)
      if (title) {
        filters.title = { $regex: title, $options: 'i' };
      }

      // Filtro por Descrição (Busca parcial)
      if (description) {
        filters.description = { $regex: description, $options: 'i' };
      }

      // Filtro por Importância (Alta, Média ou Baixa)
      if (importance) {
        filters.importance = importance;
      }

      // Filtro por Intervalo de Datas
      if (startDate || endDate) {
        filters.date = {};
        if (startDate) filters.date.$gte = new Date(startDate); // Maior ou igual
        if (endDate) filters.date.$lte = new Date(endDate);     // Menor ou igual
      }

      const tasks = await Task.find(filters).sort({ date: -1 });
      return res.json(tasks);
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
  },

  // Alterar uma tarefa
  async update(req, res) {
    try {
      const { id } = req.params;
      // Garante que o usuário só altere a PRÓPRIA tarefa
      const task = await Task.findOneAndUpdate(
        { _id: id, user: req.userId },
        req.body,
        { new: true }
      );

      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      return res.json(task);
    } catch (err) {
      return res.status(400).json({ error: 'Erro ao atualizar' });
    }
  },

  // Excluir tarefa
  async destroy(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findOneAndDelete({ _id: id, user: req.userId });

      if (!task) return res.status(404).json({ error: 'Tarefa não encontrada' });
      return res.json({ message: 'Tarefa removida com sucesso' });
    } catch (err) {
      return res.status(400).json({ error: 'Erro ao excluir' });
    }
  }
};
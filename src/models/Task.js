const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  // Níveis de importância solicitados
  importance: {
    type: String,
    enum: ['Alta', 'Média', 'Baixa'],
    default: 'Média'
  },
  // Campo de data para permitir a consulta entre períodos
  date: {
    type: Date,
    required: [true, 'A data da tarefa é obrigatória'],
    default: Date.now
  },
  // Relacionamento: cada tarefa pertence a um usuário específico
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Controle de criação/atualização automática
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexação para melhorar a performance de buscas por título e descrição
TaskSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Task', TaskSchema);
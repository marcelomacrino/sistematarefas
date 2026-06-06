const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'O e-mail é obrigatório'],
    unique: true, // Garante que não existam dois usuários com o mesmo e-mail
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória'],
    select: false, // Proteção: a senha não será retornada em consultas comuns (GET)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// --- Middleware (Hook) do Mongoose ---
// Antes de salvar o usuário no banco, criptografamos a senha
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar senhas no momento do login
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
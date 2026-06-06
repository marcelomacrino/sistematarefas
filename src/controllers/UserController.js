const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Função auxiliar para gerar o Token JWT
function generateToken(params = {}) {
  return jwt.sign(params, process.env.JWT_SECRET, {
    expiresIn: 86400, // Token expira em 24 horas
  });
}

module.exports = {
  // Cadastro de Novo Usuário
  async register(req, res) {
    const { email } = req.body;

    try {
      // Verifica se o e-mail já está cadastrado
      if (await User.findOne({ email })) {
        return res.status(400).json({ error: 'Este e-mail já está em uso' });
      }

      const user = await User.create(req.body);

      // Remove a senha do objeto de retorno por segurança
      user.password = undefined;

      return res.status(201).json({
        user,
        token: generateToken({ id: user.id }),
      });
    } catch (err) {
        console.log("🚨 ERRO DETALHADO:", err); // <-- ADICIONE ESTA LINHA AQUI
        return res.status(400).json({ error: 'Falha no cadastro' });
    }
  },

  // Autenticação (Login)
  async authenticate(req, res) {
    const { email, password } = req.body;

    // Busca o usuário e força a vinda da senha (que está como select: false no Model)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    // Compara a senha digitada com o hash no banco (método que criamos no Model)
    if (!await user.comparePassword(password)) {
      return res.status(400).json({ error: 'Senha inválida' });
    }

    user.password = undefined;

    res.json({
      user,
      token: generateToken({ id: user.id }),
    });
  }
};
// Importações necessárias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


require('dotenv').config();

// Inicialização do App
const app = express();

// --- Middlewares Globais ---
// Permite que o React e React Native acessem a API de domínios diferentes
app.use(cors()); 
// Permite que o servidor entenda requisições no formato JSON
app.use(express.json()); 

// --- Conexão com MongoDB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado ao MongoDB com sucesso!"))
  .catch((err) => console.error("❌ Erro ao conectar ao MongoDB:", err));

// --- Importação de Rotas (Exemplo de estrutura) ---
// No MVC, as rotas ficam em arquivos separados. 
// Vamos supor que você criou src/routes/taskRoutes.js
// const taskRoutes = require('./src/routes/taskRoutes');
// const userRoutes = require('./src/routes/userRoutes');

// app.use('/api/tasks', taskRoutes);
// app.use('/api/users', userRoutes);

const routes = require('./src/routes');
app.use(routes);

// Rota de teste básica
app.get('/', (req, res) => {
  res.send('API de Sistema de Tarefas Online 🚀');
});

// --- Inicialização do Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
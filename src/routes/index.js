const express = require('express');
const routes = express.Router();

const UserController = require('../controllers/UserController');
const TaskController = require('../controllers/TaskController');
const authMiddleware = require('../middlewares/auth');

// --- Rotas Públicas ---
routes.post('/register', UserController.register);
routes.post('/authenticate', UserController.authenticate);

// --- Middleware de Proteção ---
// Todas as rotas abaixo desta linha exigirão o Token JWT
routes.use(authMiddleware);

// --- Rotas de Tarefas (Privadas) ---
routes.get('/tasks', TaskController.index);          // Consultar (com filtros)
routes.post('/tasks', TaskController.store);         // Incluir
routes.put('/tasks/:id', TaskController.update);      // Alterar
routes.delete('/tasks/:id', TaskController.destroy);  // Excluir

module.exports = routes;
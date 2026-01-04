require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { connectDB } = require('./config/database');
const postsRoutes = require('./routes/posts');
const professorRoutes = require('./routes/professorRoutes');
const alunoRoutes = require('./routes/alunoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar ao banco de dados
connectDB();

// Middlewares de segurança
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    sucesso: false,
    mensagem: 'Muitas requisições. Tente novamente em 15 minutos.'
  }
});
app.use(limiter);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rota de saúde da aplicação
app.get('/health', (req, res) => {
  res.status(200).json({
    sucesso: true,
    mensagem: 'API do Blog de Aulas está funcionando!',
    timestamp: new Date().toISOString(),
    versao: '1.0.0'
  });
});

// Rotas da aplicação
app.use('/posts', postsRoutes);
app.use('/professores', professorRoutes);
app.use('/alunos', alunoRoutes);

// Rota para endpoint não encontrado
app.use('*', (req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: 'Endpoint não encontrado',
    endpoint: req.originalUrl
  });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  
  res.status(500).json({
    sucesso: false,
    mensagem: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { erro: err.message })
  });
});

// Encerrar Servidor
process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recebido. Encerrando servidor...');
  process.exit(0);
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`API do Blog de Aulas disponível em http://localhost:${PORT}`);
  console.log(`Health check em http://localhost:${PORT}/health`);
});

module.exports = app;

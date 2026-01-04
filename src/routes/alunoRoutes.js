const express = require('express');
const router = express.Router();

const {
  listarAlunos,
  buscarAlunoPorId,
  criarAluno,
  atualizarAluno,
  deletarAluno
} = require('../controllers/alunoController');

const {
  validateCreateAluno,
  validateUpdateAluno,
  validateObjectId
} = require('../middleware/validation');

// GET /alunos - Lista todos os alunos
router.get('/', listarAlunos);

// GET /alunos/:id - Busca um aluno específico
router.get('/:id', validateObjectId, buscarAlunoPorId);

// POST /alunos - Cria um novo aluno
router.post('/', validateCreateAluno, criarAluno);

// PUT /alunos/:id - Atualiza um aluno existente
router.put('/:id', validateObjectId, validateUpdateAluno, atualizarAluno);

// DELETE /alunos/:id - Remove um aluno
router.delete('/:id', validateObjectId, deletarAluno);

module.exports = router;

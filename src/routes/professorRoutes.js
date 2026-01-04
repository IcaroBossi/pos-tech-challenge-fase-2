const express = require('express');
const router = express.Router();

const {
  listarProfessores,
  buscarProfessorPorId,
  criarProfessor,
  atualizarProfessor,
  deletarProfessor
} = require('../controllers/professorController');

const {
  validateCreateProfessor,
  validateUpdateProfessor,
  validateObjectId
} = require('../middleware/validation');

// GET /professores - Lista todos os professores
router.get('/', listarProfessores);

// GET /professores/:id - Busca um professor específico
router.get('/:id', validateObjectId, buscarProfessorPorId);

// POST /professores - Cria um novo professor
router.post('/', validateCreateProfessor, criarProfessor);

// PUT /professores/:id - Atualiza um professor existente
router.put('/:id', validateObjectId, validateUpdateProfessor, atualizarProfessor);

// DELETE /professores/:id - Remove um professor
router.delete('/:id', validateObjectId, deletarProfessor);

module.exports = router;

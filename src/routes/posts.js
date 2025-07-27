const express = require('express');
const router = express.Router();

const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts
} = require('../controllers/postsController');

const {
  validateCreatePost,
  validateUpdatePost,
  validateObjectId,
  validateSearchQuery
} = require('../middleware/validation');

// GET /posts/search - Busca posts por palavra-chave
router.get('/search', validateSearchQuery, searchPosts);

// GET /posts - Lista todos os posts
router.get('/', getAllPosts);

// GET /posts/:id - Busca um post específico
router.get('/:id', validateObjectId, getPostById);

// POST /posts - Cria um novo post
router.post('/', validateCreatePost, createPost);

// PUT /posts/:id - Atualiza um post existente
router.put('/:id', validateObjectId, validateUpdatePost, updatePost);

// DELETE /posts/:id - Remove um post
router.delete('/:id', validateObjectId, deletePost);

module.exports = router;

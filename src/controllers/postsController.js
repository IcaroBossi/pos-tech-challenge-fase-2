const Post = require('../models/Post');

// GET /posts - Lista todos os posts
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, autor, disciplina } = req.query;
    const skip = (page - 1) * limit;
    
    // Filtros
    const filtros = {};
    if (autor) filtros.autor = new RegExp(autor, 'i');
    if (disciplina) filtros.disciplina = new RegExp(disciplina, 'i');
    
    // Buscar posts com paginação
    const posts = await Post.find(filtros)
      .sort({ dataCriacao: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select('-__v');
    
    // Total de posts para paginação
    const total = await Post.countDocuments(filtros);
    
    res.status(200).json({
      sucesso: true,
      dados: posts,
      paginacao: {
        paginaAtual: parseInt(page),
        totalPaginas: Math.ceil(total / limit),
        totalPosts: total,
        postsPorPagina: posts.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// GET /posts/:id - Busca um post específico
const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const post = await Post.findById(id).select('-__v');
    
    if (!post) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Post não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      dados: post
    });
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// POST /posts - Cria um novo post
const createPost = async (req, res) => {
  try {
    const { titulo, conteudo, autor, disciplina, tags } = req.body;
    
    const novoPost = new Post({
      titulo,
      conteudo,
      autor,
      disciplina,
      tags
    });
    
    const postSalvo = await novoPost.save();
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Post criado com sucesso',
      dados: postSalvo
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros
      });
    }
    
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// PUT /posts/:id - Atualiza um post existente
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = { ...req.body };
    
    // Atualizar data de modificação
    dadosAtualizacao.dataAtualizacao = new Date();
    
    const postAtualizado = await Post.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { 
        new: true, // Retorna o documento atualizado
        runValidators: true // Executa validações do schema
      }
    ).select('-__v');
    
    if (!postAtualizado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Post não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Post atualizado com sucesso',
      dados: postAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros
      });
    }
    
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// DELETE /posts/:id - Remove um post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const postRemovido = await Post.findByIdAndDelete(id);
    
    if (!postRemovido) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Post não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Post removido com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover post:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// GET /posts/search - Busca posts por palavra-chave
const searchPosts = async (req, res) => {
  try {
    const { q: termoBusca, page = 1, limit = 10 } = req.query;
    
    if (!termoBusca) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Termo de busca é obrigatório'
      });
    }
    
    const skip = (page - 1) * limit;
    
    // Busca usando texto completo ou regex
    const filtro = {
      $or: [
        { titulo: new RegExp(termoBusca, 'i') },
        { conteudo: new RegExp(termoBusca, 'i') },
        { autor: new RegExp(termoBusca, 'i') },
        { disciplina: new RegExp(termoBusca, 'i') },
        { tags: { $in: [new RegExp(termoBusca, 'i')] } }
      ]
    };
    
    const posts = await Post.find(filtro)
      .sort({ dataCriacao: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select('-__v');
    
    const total = await Post.countDocuments(filtro);
    
    res.status(200).json({
      sucesso: true,
      dados: posts,
      termoBusca,
      paginacao: {
        paginaAtual: parseInt(page),
        totalPaginas: Math.ceil(total / limit),
        totalPosts: total,
        postsPorPagina: posts.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  searchPosts
};

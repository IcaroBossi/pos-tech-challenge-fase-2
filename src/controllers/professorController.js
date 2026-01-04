const Professor = require('../models/Professor');

// GET /professores - Lista todos os professores
const listarProfessores = async (req, res) => {
  try {
    const { page = 1, limit = 10, nome, disciplina } = req.query;
    const skip = (page - 1) * limit;
    
    // Filtros
    const filtros = {};
    if (nome) filtros.nome = new RegExp(nome, 'i');
    if (disciplina) filtros.disciplina = new RegExp(disciplina, 'i');
    
    // Buscar professores com paginação
    const professores = await Professor.find(filtros)
      .sort({ dataCriacao: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select('-__v');
    
    // Total de professores para paginação
    const total = await Professor.countDocuments(filtros);
    
    res.status(200).json({
      sucesso: true,
      dados: professores,
      paginacao: {
        paginaAtual: parseInt(page),
        totalPaginas: Math.ceil(total / limit),
        totalProfessores: total,
        professoresPorPagina: professores.length
      }
    });
  } catch (error) {
    console.error('Erro ao buscar professores:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// GET /professores/:id - Busca um professor específico
const buscarProfessorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const professor = await Professor.findById(id).select('-__v');
    
    if (!professor) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Professor não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      dados: professor
    });
  } catch (error) {
    console.error('Erro ao buscar professor:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// POST /professores - Cria um novo professor
const criarProfessor = async (req, res) => {
  try {
    const { nome, email, disciplina } = req.body;
    
    // Verificar se já existe professor com este email
    const professorExistente = await Professor.findOne({ email: email.toLowerCase() });
    if (professorExistente) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe um professor cadastrado com este email'
      });
    }
    
    const novoProfessor = new Professor({
      nome,
      email,
      disciplina
    });
    
    const professorSalvo = await novoProfessor.save();
    
    res.status(201).json({
      sucesso: true,
      mensagem: 'Professor criado com sucesso!',
      dados: professorSalvo
    });
  } catch (error) {
    console.error('Erro ao criar professor:', error);
    
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe um professor cadastrado com este email'
      });
    }
    
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// PUT /professores/:id - Atualiza um professor existente
const atualizarProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizacao = { ...req.body };
    
    // Se o email está sendo atualizado, verificar duplicidade
    if (dadosAtualizacao.email) {
      const professorExistente = await Professor.findOne({ 
        email: dadosAtualizacao.email.toLowerCase(),
        _id: { $ne: id }
      });
      if (professorExistente) {
        return res.status(400).json({
          sucesso: false,
          mensagem: 'Já existe um professor cadastrado com este email'
        });
      }
    }
    
    // Atualizar data de modificação
    dadosAtualizacao.dataAtualizacao = new Date();
    
    const professorAtualizado = await Professor.findByIdAndUpdate(
      id,
      dadosAtualizacao,
      { 
        new: true,
        runValidators: true
      }
    ).select('-__v');
    
    if (!professorAtualizado) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Professor não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Professor atualizado com sucesso!',
      dados: professorAtualizado
    });
  } catch (error) {
    console.error('Erro ao atualizar professor:', error);
    
    if (error.name === 'ValidationError') {
      const erros = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Dados inválidos',
        erros
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        sucesso: false,
        mensagem: 'Já existe um professor cadastrado com este email'
      });
    }
    
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

// DELETE /professores/:id - Remove um professor
const deletarProfessor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const professorRemovido = await Professor.findByIdAndDelete(id);
    
    if (!professorRemovido) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Professor não encontrado'
      });
    }
    
    res.status(200).json({
      sucesso: true,
      mensagem: 'Professor removido com sucesso!',
      dados: professorRemovido
    });
  } catch (error) {
    console.error('Erro ao deletar professor:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  listarProfessores,
  buscarProfessorPorId,
  criarProfessor,
  atualizarProfessor,
  deletarProfessor
};
